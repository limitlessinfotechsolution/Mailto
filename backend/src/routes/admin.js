import express from 'express';
import bcrypt from 'bcryptjs';
import { User, Domain } from '@mailo/shared';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Middleware to check for admin role
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'super_admin' && req.user.role !== 'domain_admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  next();
};

router.use(auth, adminOnly);

// --- Domains ---

router.get('/domains', async (req, res) => {
  try {
    const domains = await Domain.find();
    res.json(domains);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/domains', async (req, res) => {
  try {
    const { name } = req.body;
    const domain = new Domain({ name });
    await domain.save();
    res.status(201).json(domain);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Users ---

router.get('/users', async (req, res) => {
  try {
    const users = await User.find().populate('domain').select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/users', async (req, res) => {
  try {
    const { email, password, domainId, role } = req.body;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({
      email,
      passwordHash,
      domain: domainId,
      role: role || 'user'
    });

    await user.save();
    res.status(201).json({ ...user.toObject(), passwordHash: undefined });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
