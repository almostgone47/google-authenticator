const fs = require('fs');
const path = require('path');

const argv = require('yargs').argv;
const speakeasy = require('speakeasy');
const qrcode = require('qrcode-terminal');
const QRCode = require('qrcode');

async function getQRCode(secret) {
  var otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: 'CS370:Programming Project - OTP',
    algorithm: 'SHA1',
  });

  const code = await QRCode.toDataURL(otpauthUrl);
  return code;
}

function verifyToken(secret, token) {
  try {
    const tokenValidates = speakeasy.totp.verify({
      secret: secret.base32,
      encoding: 'base32',
      token: token,
      window: 6,
    });

    console.log('verifyToken tokenValidates:', tokenValidates);
    return tokenValidates;
  } catch (error) {
    console.error('Error verifying token:', error);
    return false;
  }
}
// FUNCTIONS FOR CLIENT APP ENDS //

function generateSecret() {
  return speakeasy.generateSecret();
}

// FUNCTIONS FOR COMMAND LINE APP STARTS //
function printQRCode(secret) {
  const otpauthUrl = speakeasy.otpauthURL({
    secret: secret.base32,
    label: 'CS370:Programming Project - OTP',
    algorithm: 'SHA1',
  });

  console.log('Secret:', secret.base32);
  qrcode.generate(otpauthUrl, {small: true});
}

function getOTP(secret) {
  const token = speakeasy.totp({
    secret: secret,
    algorithm: 'SHA1',
    digits: 6,
  });

  console.log('getOTP token:', token);
}

function main() {
  const secret = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'secret.json'), 'utf8'),
  );
  const secret32 = secret.base32;

  if (argv.generateQr) {
    printQRCode(secret);
  } else if (argv.getOtp) {
    getOTP(secret32);
  }
}

main();
