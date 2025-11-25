import express from 'express';
import { Message, Folder } from '@mailo/shared';
import { auth } from '../middleware/auth.js';
import { logger } from '@mailo/shared';
import { emailQueue } from '../worker.js';

const router = express.Router();

// Get messages with search and filters
router.get('/:folderId', auth, async (req, res) => {
  try {
    const { folderId } = req.params;
    const { q, hasAttachment, startDate, endDate } = req.query;

    let query = {
      user: req.user._id,
      folder: folderId
    };

    // Search logic
    if (q) {
      const regex = new RegExp(q, 'i');
      query.$or = [
        { subject: regex },
        { 'from.name': regex },
        { 'from.address': regex },
        { snippet: regex },
        { text: regex }
      ];
    }

    // Filter by attachment
    if (hasAttachment === 'true') {
      query.hasAttachments = true;
    }

    // Filter by date
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    logger.error('Error fetching messages:', err);
    res.status(500).json({ error: err.message });
  }
});

// Snooze a message
router.post('/:id/snooze', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { snoozeUntil } = req.body;
    
    if (!snoozeUntil) {
      return res.status(400).json({ error: 'snoozeUntil is required' });
    }

    const delay = new Date(snoozeUntil).getTime() - Date.now();
    if (delay <= 0) {
      return res.status(400).json({ error: 'snoozeUntil must be in the future' });
    }

    // Find or create Snoozed folder
    let snoozedFolder = await Folder.findOne({ user: req.user._id, type: 'snoozed' });
    if (!snoozedFolder) {
      snoozedFolder = await Folder.create({
        user: req.user._id,
        name: 'Snoozed',
        type: 'snoozed',
        icon: 'FiClock'
      });
    }

    // Move message to Snoozed folder
    const message = await Message.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { folder: snoozedFolder._id },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Schedule unsnooze job
    await emailQueue.add(
      'unsnooze-email',
      { messageId: message._id, userId: req.user._id },
      { delay }
    );

    res.json({ message: 'Message snoozed', data: message });
  } catch (err) {
    logger.error('Snooze error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Undo a scheduled email
router.post('/undo/:jobId', auth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await emailQueue.getJob(jobId);
    
    if (job) {
      await job.remove();
      res.json({ message: 'Email sending cancelled' });
    } else {
      res.status(404).json({ error: 'Job not found or already processed' });
    }
  } catch (err) {
    logger.error('Undo error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Send a new email
router.post('/send', auth, async (req, res) => {
  try {
    const { to, subject, text, html, attachments = [], scheduledAt } = req.body;
    
    // Prepare attachments for nodemailer/queue
    const emailAttachments = attachments.map(att => ({
      filename: att.filename,
      path: att.path // File path from upload
    }));

    let delay = 10000; // Default 10s delay for Undo Send
    if (scheduledAt) {
      const scheduleDelay = new Date(scheduledAt).getTime() - Date.now();
      if (scheduleDelay > 0) {
        delay = scheduleDelay;
      }
    }

    const job = await emailQueue.add(
      'send-scheduled-email', 
      {
        to,
        subject,
        text,
        html,
        attachments: emailAttachments,
        from: req.user.email,
        userId: req.user._id
      },
      { delay }
    );

    res.json({ 
      message: 'Email scheduled successfully',
      jobId: job.id,
      scheduledAt: scheduledAt || new Date(Date.now() + delay)
    });
    
  } catch (err) {
    logger.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
