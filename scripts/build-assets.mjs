import { cp, mkdir, readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const destination = path.join(root, '.assets');
await rm(destination, { recursive: true, force: true });
await mkdir(destination);
// Explicit public directories keep server code, tests, credentials and tooling
// outside the asset binding, without moving existing portfolio URLs.
const directories = new Set(['exports', 'output', 'projects', 'shots', 'uploads']);
for (const entry of await readdir(root, { withFileTypes: true })) {
  if (entry.isDirectory() ? directories.has(entry.name) : /\.(html|js|png|jpg|jpeg|ico|svg|txt|xml)$/.test(entry.name)) {
    await cp(path.join(root, entry.name), path.join(destination, entry.name), { recursive: true });
  }
}
console.log('Public assets built in .assets; server modules remain private.');
