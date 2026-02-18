#!/usr/bin/env node
/**
 * Encrypt DB password for this API's config/db-config.js.
 * Usage: node bin/encrypt-password.js <plainPassword>
 * Run from ormapi folder, or from repo root: node ormapi/bin/encrypt-password.js <plainPassword>
 */
const path = require('path');
const { spawnSync } = require('child_process');
const repoRoot = path.resolve(__dirname, '..', '..');
const script = path.join(repoRoot, 'scripts', 'encrypt-db-password.js');
const pwd = process.argv[2];
if (!pwd) {
  console.error('Usage: node bin/encrypt-password.js <plainPassword>');
  process.exit(1);
}
const r = spawnSync(process.execPath, [script, pwd, 'ormapi'], { stdio: 'inherit', cwd: repoRoot });
process.exit(r.status || 0);
