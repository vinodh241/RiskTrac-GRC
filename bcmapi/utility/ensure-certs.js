/**
 * Ensures bcmapi config/certs has public.pem and private.pem for decrypting SFTP/DB secrets.
 * If private.pem is missing, generates a new key pair. Call at build time or startup.
 */
const PATH = require('path');
const FS = require('fs');
const CRYPTO = require('crypto');

function ensureCerts() {
  const certsDir = PATH.join(__dirname, '..', 'config', 'certs');
  const privatePath = PATH.join(certsDir, 'private.pem');
  if (FS.existsSync(privatePath)) return true;
  try {
    if (!FS.existsSync(certsDir)) FS.mkdirSync(certsDir, { recursive: true });
    const { publicKey, privateKey } = CRYPTO.generateKeyPairSync('rsa', {
      modulusLength: 4096,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    FS.writeFileSync(PATH.join(certsDir, 'public.pem'), publicKey, 'utf8');
    FS.writeFileSync(privatePath, privateKey, 'utf8');
    if (typeof console !== 'undefined') console.log('BCM API: generated new certs in config/certs (private.pem, public.pem)');
    return true;
  } catch (e) {
    if (typeof console !== 'undefined') console.error('BCM API: failed to generate certs:', e && (e.message || e));
    return false;
  }
}

module.exports = { ensureCerts };
