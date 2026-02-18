#!/usr/bin/env node
/**
 * Encrypt DB password for use in config/db-config.js (all API modules).
 * Usage: node scripts/encrypt-db-password.js <plainPassword> [apiName]
 *   apiName: authapi | umapi | ormapi | bcmapi (default: all; outputs one line per API)
 * Example: node scripts/encrypt-db-password.js RegxTrac1234
 *          node scripts/encrypt-db-password.js RegxTrac1234 umapi
 */
const path = require('path');
const fs = require('fs');
const apis = ['authapi', 'umapi', 'ormapi', 'bcmapi'];

function encrypt(publicKeyPem, plainPassword, apiDir) {
  const modPath = path.join(apiDir, 'node_modules', 'node-jsencrypt');
  const JS_ENCRYPT_LIB_OBJ = require(modPath);
  const obj = new JS_ENCRYPT_LIB_OBJ();
  obj.setPrivateKey(publicKeyPem); // API uses same method for public key encryption
  return obj.encrypt(plainPassword);
}

const repoRoot = path.resolve(__dirname, '..');
const password = process.argv[2];
const apiArg = (process.argv[3] || '').toLowerCase();

if (!password) {
  console.error('Usage: node scripts/encrypt-db-password.js <plainPassword> [apiName]');
  process.exit(1);
}

const apisToRun = apiArg && apis.includes(apiArg) ? [apiArg] : apis;

for (const apiName of apisToRun) {
  const certPath = path.join(repoRoot, apiName, 'config', 'certs', 'public.pem');
  if (!fs.existsSync(certPath)) {
    console.error(apiName + ': public.pem not found at ' + certPath);
    continue;
  }
  try {
    const publicKey = fs.readFileSync(certPath, 'utf8');
    const apiDir = path.join(repoRoot, apiName);
    const encrypted = encrypt(publicKey, password, apiDir);
    if (apisToRun.length > 1) {
      console.log(apiName + ':\n' + encrypted + '\n');
    } else {
      console.log(encrypted);
    }
  } catch (e) {
    console.error(apiName + ': ' + (e.message || e));
  }
}
