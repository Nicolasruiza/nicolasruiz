import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { chromium } from '@playwright/test';
import { createRuntime } from './runtime.mjs';

const runtime = await createRuntime();
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
await mkdir('test-results', { recursive: true });
try {
  for (const country of ['CA', 'CO', undefined]) {
    for (const javaScriptEnabled of [true, false]) {
      for (const width of [1440, 768, 390]) {
        const context = await browser.newContext({ viewport: { width, height: 1000 }, javaScriptEnabled });
        await context.route('https://portfolio.test/**', async route => {
          const response = await runtime.dispatchFetch(route.request().url(), { cf: country ? { country } : {} });
          await route.fulfill({ status: response.status, headers: Object.fromEntries(response.headers), body: Buffer.from(await response.arrayBuffer()) });
        });
        const page = await context.newPage();
        const heroMeasurements = {};
        for (const path of ['/', '/contact.html']) {
          await page.goto(`https://portfolio.test${path}`);
          await page.evaluate(() => document.fonts.ready);
          const name = `${country ?? 'unknown'}-${path === '/' ? 'home' : 'contact'}-${width}-${javaScriptEnabled ? 'js' : 'nojs'}`;
          const body = await page.locator('body').innerText();
          assert.equal(body.includes('Preparing to relocate to Colombia'), country !== 'CA', name);
          if (country === 'CA' && path !== '/') assert.ok(!/colombia/i.test(body), name);
          const bounds = await page.evaluate(() => {
            const hero = document.querySelector('.hero').getBoundingClientRect();
            const grid = document.querySelector('.hero-grid').getBoundingClientRect();
            const copy = document.querySelector('.hero-copy, .contact-card').getBoundingClientRect();
            const eyebrow = document.querySelector('.eyebrow').getBoundingClientRect();
            const portrait = document.querySelector('.portrait').getBoundingClientRect();
            return {
              hero: hero.bottom,
              gridHeight: grid.height,
              contentTop: eyebrow.top - grid.top,
              copyBottom: copy.bottom,
              portraitHeight: portrait.height,
              portraitBottom: portrait.bottom,
              portraitBottomInGrid: grid.bottom - portrait.bottom,
              width: document.documentElement.scrollWidth,
              viewport: innerWidth,
            };
          });
          heroMeasurements[path] = bounds;
          assert.ok(bounds.hero >= bounds.copyBottom - 1 && bounds.hero >= bounds.portraitBottom - 1, `${name}: hero clipping ${JSON.stringify(bounds)}`);
          assert.ok(bounds.width <= bounds.viewport + 1, `${name}: horizontal overflow`);
          // Explicitly check the changed blocks and adjacent actions in print too.
          await page.emulateMedia({ media: 'print' });
          assert.equal((await page.locator('body').innerText()).includes('Preparing to relocate'), country !== 'CA');
          await page.emulateMedia({ media: 'screen' });
          await page.screenshot({ path: `test-results/${name}.png`, fullPage: true });
          // A decorative gradient must not be required for text to remain legible.
          if (javaScriptEnabled && country === 'CO') {
            await page.addStyleTag({ content: '.hero, .cta { background-image: none !important; }' });
            await page.screenshot({ path: `test-results/${name}-no-background.png`, fullPage: true });
          }
          console.log(`PASS ${name}`);
        }
        assert.ok(
          Math.abs(heroMeasurements['/'].portraitHeight - heroMeasurements['/contact.html'].portraitHeight) <= 1,
          `home/contact portrait height mismatch: ${JSON.stringify(heroMeasurements)}`,
        );
        if (country === 'CA' && width > 900) {
          assert.ok(
            Math.abs(heroMeasurements['/'].gridHeight - heroMeasurements['/contact.html'].gridHeight) <= 1,
            `home/contact desktop hero height mismatch: ${JSON.stringify(heroMeasurements)}`,
          );
          assert.ok(
            Math.abs(heroMeasurements['/'].contentTop - heroMeasurements['/contact.html'].contentTop) <= 1,
            `home/contact desktop top spacing mismatch: ${JSON.stringify(heroMeasurements)}`,
          );
          assert.ok(
            Math.abs(heroMeasurements['/'].portraitBottomInGrid - heroMeasurements['/contact.html'].portraitBottomInGrid) <= 1,
            `home/contact desktop portrait alignment mismatch: ${JSON.stringify(heroMeasurements)}`,
          );
        }
        await context.close();
      }
    }
  }
} finally {
  await browser.close();
  await runtime.dispose();
}
