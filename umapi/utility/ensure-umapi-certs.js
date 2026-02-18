/**
 * Ensures umapi config/certs/secret.pem exists for JWT signing.
 * If missing, creates the certs dir and writes a generated secret so login/JWT work.
 */
const PATH = require('path');
const FS = require('fs');
const CRYPTO = require('crypto');

function ensureSecretPem() {
  const certsDir = PATH.join(__dirname, '..', 'config', 'certs');
  const secretPath = PATH.join(certsDir, 'secret.pem');
  if (FS.existsSync(secretPath)) return true;
  try {
    if (!FS.existsSync(certsDir)) FS.mkdirSync(certsDir, { recursive: true });
    const secret = CRYPTO.randomBytes(64).toString('hex');
    FS.writeFileSync(secretPath, secret, 'utf8');
    if (typeof console !== 'undefined') console.log('UM API: generated config/certs/secret.pem for JWT signing');
    return true;
  } catch (e) {
    if (typeof console !== 'undefined') console.error('UM API: failed to generate secret.pem:', e && (e.message || e));
    return false;
  }
}

module.exports = { ensureSecretPem };
