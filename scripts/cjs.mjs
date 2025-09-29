
// Simple ESM->CJS wrapper by re-exporting compiled JS (already ESM).
// Builds CJS files next to ESM for users requiring require().
import { promises as fs } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');

async function main() {
  // Create a single CJS index that requires the ESM default exports via dynamic import shim.
  const esmEntry = 'index.js';
  const cjsEntry = 'index.cjs';
  const shim = `
'use strict';
const m = require('./index.js');
module.exports = m;
`;
  await fs.writeFile(join(dist, cjsEntry), shim, 'utf8');
}
main().catch((e) => { console.error(e); process.exit(1); });
