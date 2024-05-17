const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();

const {getQRCode, verifyToken} = require('./otp.js');
let currentSecret = null;

app.use(express.json());
app.use(express.static('public'));
app.use('/scripts', express.static('node_modules/qrcode/build'));

app.get('/get-qrcode', async (req, res) => {
  try {
    const secret = fs.readFileSync(path.join(__dirname, 'secret.json'), 'utf8');
    currentSecret = secret;
    const qrCode = await getQRCode(secret);
    res.send(qrCode);
  } catch (err) {
    res.status(500).send('Error generating QR code');
  }
});

app.post('/verify-otp', (req, res) => {
  const {token} = req.body;
  const isValid = verifyToken(currentSecret.base32, token);
  res.json({valid: isValid});
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
