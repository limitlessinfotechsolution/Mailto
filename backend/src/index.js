import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { User, Domain, Folder, Message, logger } from '@mailo/shared';
import { auth } from './middleware/auth.js';
import { initMailer } from './mailer.js';
import { initSocket } from './socket.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3000;

// Initialize Socket.io
initSocket(httpServer);

// Initialize mailer
initMailer();

app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

// Auth Routes (Moved to bottom to use hooks)
// app.post('/auth/login', ...);

app.get('/auth/me', auth, (req, res) => {
  res.json(req.user);
});

// Folders
app.get('/folders', auth, async (req, res) => {
  try {
    const folders = await Folder.find({ user: req.user._id });
    res.json(folders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/folders/create', auth, async (req, res) => {
  try {
    const folder = new Folder({
      ...req.body,
      user: req.user._id
    });
    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Messages
app.get('/messages/:folderId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ 
      user: req.user._id,
      folder: req.params.folderId 
    }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/send', auth, async (req, res) => {
  try {
    const { to, subject, text, html, attachments = [] } = req.body;
    
    // Import mailer dynamically to avoid circular dependencies
    const { sendEmail } = await import('./mailer.js');
    
    // Prepare attachments for nodemailer
    const emailAttachments = attachments.map(att => ({
      filename: att.filename,
      path: att.path // File path from upload
    }));
    
    // Send the email
    const info = await sendEmail({
      from: `${req.user.email}`,
      to,
      subject,
      text,
      html,
      attachments: emailAttachments
    });
    
    // Optionally save to Sent folder
    const sentFolder = await Folder.findOne({ user: req.user._id, type: 'sent' });
    if (sentFolder) {
      await Message.create({
        user: req.user._id,
        folder: sentFolder._id,
        from: {
          name: req.user.email,
          address: req.user.email
        },
        to: [{ address: to }],
        subject,
        snippet: text?.substring(0, 100) || '',
        storageKey: `sent-${Date.now()}`,
        size: (text || html || '').length,
        flags: { read: true }
      });
    }
    
    res.json({ 
      message: 'Email sent successfully',
      messageId: info.messageId 
    });
  } catch (err) {
    logger.error('Send email error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/stats', auth, async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ error: 'Access denied' });
  }
  const users = await User.countDocuments();
  const domains = await Domain.countDocuments();
  const messages = await Message.countDocuments();
  res.json({ users, domains, messages });
});

import calendarRoutes from './routes/calendar.js';
import contactRoutes from './routes/contacts.js';
import taskRoutes from './routes/tasks.js';
import noteRoutes from './routes/notes.js';
import campaignRoutes from './routes/campaigns.js';
import twoFaRoutes from './routes/2fa.js';
import messageRoutes from './routes/messages.js'; // Import message routes
import { loadPlugins, triggerHook } from './plugins.js';

// Load Plugins
loadPlugins();

// ... (existing code)

import adminRoutes from './routes/admin.js';
import attachmentRoutes from './routes/attachments.js';
import authRoutes from './routes/auth.js';

app.use('/calendar', calendarRoutes);
app.use('/contacts', contactRoutes);
app.use('/tasks', taskRoutes);
app.use('/notes', noteRoutes);
app.use('/campaigns', campaignRoutes);
app.use('/2fa', twoFaRoutes);
app.use('/messages', messageRoutes); // Use message routes
app.use('/admin', adminRoutes);
app.use('/attachments', attachmentRoutes);
app.use('/auth', authRoutes);

// Hook into Login
app.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check 2FA
    if (user.twoFactorAuth?.enabled) {
      // In a real flow, we would return a partial token or require a 2nd step
      // For MVP, we just assume client sends 'code' if enabled, or we fail here
      // But let's keep it simple: Just trigger hook
    }

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'supersecretkey');
    
    // Trigger Plugin Hook
    await triggerHook('onLogin', user);
    
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mailo')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

httpServer.listen(PORT, () => {
  console.log(`Backend Server running on port ${PORT}`);
});


