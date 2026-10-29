import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { createRuntime } from './runtime.mjs';
import { marketForCountry } from '../server/market-blocks.mjs';
import { fitsUpstreamUrl } from '../server/worker.mjs';

let runtime;
before(async () => { runtime = await createRuntime(); });
after(async () => { await runtime?.dispose(); });
const fetchPage = (path, country, options = {}) => runtime.dispatchFetch(`https://nicolasruiz.net${path}`, {
  ...options, cf: country === undefined ? {} : { country },
});
const relocation = /Preparing to relocate to Colombia in 2027/;

test('only Canada selects Canada; every other or unknown country selects Colombia', () => {
  for (const value of ['CA', 'ca', ' CA ']) assert.equal(marketForCountry(value), 'canada');
  for (const value of ['CO', 'US', 'AR', 'XX', 'T1', '', undefined, null, 42]) assert.equal(marketForCountry(value), 'colombia');
});

test('FITS paths remain under the portfolio URL while mapping to GitHub Pages', () => {
  assert.equal(fitsUpstreamUrl('https://nicolasruiz.net/fits').href, 'https://nicolasruiza.github.io/Fits/');
  assert.equal(fitsUpstreamUrl('https://nicolasruiz.net/fits/home-v2.css?v=26').href, 'https://nicolasruiza.github.io/Fits/home-v2.css?v=26');
});

for (const country of ['CA', 'CO', 'US', 'XX', '', undefined]) {
  for (const path of ['/', '/index.html', '/index', '/contact.html', '/contact', '/%69ndex.html', '/contact.html?country=CA']) {
    test(`${country ?? 'missing'} receives the correct raw HTML at ${path}`, async () => {
      const response = await fetchPage(path, country);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('location'), null);
      const html = await response.text();
      assert.equal(relocation.test(html), country !== 'CA');
      assert.doesNotMatch(html, /data-market-slot/);
      if (country === 'CA') assert.doesNotMatch(html, /2027|Colombian residence|roles across Colombia/);
      if (path.startsWith('/contact')) {
        assert.equal(html.includes('Colombian residence'), country !== 'CA');
        if (country === 'CA') {
          assert.doesNotMatch(html, /colombia|citizenship|<section class="prototype-card"/i);
        } else {
          assert.match(html, /prototype-card/);
          assert.match(html, /Argentine citizenship/);
          assert.match(html, /Canadian citizenship/);
        }
      }
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.equal(response.headers.get('cloudflare-cdn-cache-control'), 'no-store');
      assert.equal(response.headers.get('etag'), null);
      assert.equal(response.headers.get('last-modified'), null);
    });
  }
}

test('spoofed headers, cookies and URL parameters cannot select the country', async () => {
  const options = { headers: { 'cf-ipcountry': 'CO', 'x-vercel-ip-country': 'CO', cookie: 'country=CO', 'accept-language': 'es-CO' } };
  const response = await fetchPage('/?country=CO', 'CA', options);
  assert.doesNotMatch(await response.text(), relocation);
  const unknown = await fetchPage('/', undefined, { headers: { 'cf-ipcountry': 'CA' } });
  assert.match(await unknown.text(), relocation);
});

test('alternating countries and conditional/range requests cannot reuse regional HTML', async () => {
  for (const country of ['CO', 'CA', 'CO', 'CA']) {
    const response = await fetchPage('/', country, { headers: {
      'if-none-match': '*', 'if-modified-since': 'Wed, 01 Jan 2031 00:00:00 GMT', range: 'bytes=0-300',
    } });
    assert.equal(response.status, 200);
    assert.equal(relocation.test(await response.text()), country === 'CO');
  }
});

test('HEAD has the same non-cacheable HTML headers and no body', async () => {
  const response = await fetchPage('/contact.html', 'CA', { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  assert.equal(await response.text(), '');
});

test('historical experience, achievements and resume pages are unchanged for both countries', async () => {
  for (const path of ['experience.html', 'achievements.html', 'resume.html', 'resume-print.html', 'resume-pdf.html', 'Home.dc.html']) {
    const source = await readFile(path, 'utf8');
    for (const country of ['CA', 'CO']) {
      const response = await fetchPage(`/${encodeURI(path)}`, country);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), source);
    }
  }
});

test('navigation, downloads and canonical URLs are identical across markets', async () => {
  for (const path of ['/', '/contact.html']) {
    const ca = await (await fetchPage(path, 'CA')).text();
    const co = await (await fetchPage(path, 'CO')).text();
    const links = html => [...html.matchAll(/(?:href|src)="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(links(ca), links(co));
    assert.match(ca, /rel="canonical" href="https:\/\/nicolasruiz.net\//);
    assert.match(ca, /name="description"/);
  }
  for (const path of ['/profile-transparent.png', '/portrait-data.js', '/output/pdf/Nicolas-Ruiz-Resume.pdf?v=profile-20261011', '/projects/cost-estimator.html']) {
    const response = await fetchPage(path, 'CA');
    assert.equal(response.status, 200);
    assert.ok((await response.arrayBuffer()).byteLength > 0);
  }
});

test('server blocks and configuration are not exposed as public files', async () => {
  const entries = await readdir('.assets');
  for (const name of ['server', 'tests', 'scripts', 'node_modules', 'package.json', 'wrangler.jsonc', 'AGENTS.md']) assert.ok(!entries.includes(name));
  for (const path of ['/server/market-blocks.mjs', '/server/worker.mjs', '/.git/config', '/wrangler.jsonc', '/does-not-exist']) {
    assert.equal((await fetchPage(path, 'CA')).status, 404);
  }
  assert.equal((await fetchPage('/', 'CA', { method: 'POST' })).status, 405);
});

test('AI Projects is served at a clean URL and old URLs redirect to it', async () => {
  const source = await readFile('AI Projects.dc.html', 'utf8');
  for (const country of ['CA', 'CO']) {
    const response = await fetchPage('/ai-projects', country);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), source);
  }
  for (const path of ['/AI%20Projects.dc.html', '/ai-projects/', '/AI%20Projects.dc.html?x=1']) {
    const response = await fetchPage(path, 'CA', { redirect: 'manual' });
    assert.equal(response.status, 301);
    assert.equal(new URL(response.headers.get('location')).pathname, '/ai-projects');
  }
});

test('the Helix prototype linked from AI Projects is served, with its app icon', async () => {
  for (const path of ['/helix', '/helix/']) {
    const response = await fetchPage(path, 'CA');
    assert.equal(response.status, 200);
    assert.match(await response.text(), /apple-touch-icon" href="\/shots\/apps\/helix\.png"/);
  }
  const icon = await fetchPage('/shots/apps/helix.png', 'CA');
  assert.equal(icon.status, 200);
});

test('every app icon referenced on AI Projects exists', async () => {
  const source = await readFile('AI Projects.dc.html', 'utf8');
  const icons = [...new Set([...source.matchAll(/shots\/apps\/[a-z0-9-]+\.png/g)].map(m => m[0]))];
  assert.ok(icons.length >= 7);
  for (const icon of icons) assert.equal((await fetchPage(`/${icon}`, 'CA')).status, 200, icon);
});
