import express from 'express';
import { Campaign } from '@mailo/shared';
import { auth } from '../middleware/auth.js';
import { scheduleCampaign } from '../worker.js';

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id });
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const campaign = new Campaign({
      ...req.body,
      user: req.user._id
    });
    await campaign.save();
    res.status(201).json(campaign);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/:id/send', auth, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ _id: req.params.id, user: req.user._id });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    
    // Trigger background worker
    await scheduleCampaign(campaign._id);
    
    res.json({ message: 'Campaign scheduled for sending' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
