import express from 'express';
import bcrypt from 'bcryptjs';
import { User } from '@mailo/shared';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Change password
router.post('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update signature
router.post('/update-signature', auth, async (req, res) => {
  try {
    const { signature } = req.body;
    
    await User.findByIdAndUpdate(req.user._id, { signature });
    
    res.json({ message: 'Signature updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
