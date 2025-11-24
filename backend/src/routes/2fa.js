import express from 'express';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Generate 2FA Secret
router.post('/generate', auth, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({
      name: `MailO (${req.user.email})`
    });

    // Save secret temporarily or permanently depending on flow
    // Ideally, we save it to user but mark as 'pending_verification'
    req.user.twoFactorAuth.secret = secret.base32;
    await req.user.save();

    const dataUrl = await QRCode.toDataURL(secret.otpauth_url);
    res.json({ secret: secret.base32, qrCode: dataUrl });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Verify and Enable 2FA
router.post('/verify', auth, async (req, res) => {
  try {
    const { token } = req.body;
    const verified = speakeasy.totp.verify({
      secret: req.user.twoFactorAuth.secret,
      encoding: 'base32',
      token
    });

    if (verified) {
      req.user.twoFactorAuth.enabled = true;
      await req.user.save();
      res.json({ message: '2FA Enabled successfully' });
    } else {
      res.status(400).json({ error: 'Invalid token' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
