import { readFile } from 'node:fs/promises';
import { Miniflare } from 'miniflare';

// Mirror the checked-in deployment config using Cloudflare's actual local runtime.
export async function createRuntime() {
  const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
  return new Miniflare({
    modules: true,
    scriptPath: config.main,
    compatibilityDate: config.compatibility_date,
    cf: false,
    assets: {
      directory: config.assets.directory,
      binding: config.assets.binding,
      routerConfig: { has_user_worker: true, invoke_user_worker_ahead_of_assets: config.assets.run_worker_first },
      assetConfig: { html_handling: config.assets.html_handling, not_found_handling: config.assets.not_found_handling },
    },
  });
}
