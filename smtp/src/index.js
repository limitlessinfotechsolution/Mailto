import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Message, Folder, saveMessageBody, initStorage, logger } from '@mailo/shared';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mailo')
  .then(() => {
    console.log('MongoDB Connected (SMTP)');
    initStorage(); // Init MinIO bucket
  })
  .catch(err => console.error('MongoDB Connection Error:', err));

const server = new SMTPServer({
  authOptional: true, // Allow unauthenticated for local dev/testing, but in prod should be false
  
  // Authentication Handler
  async onAuth(auth, session, callback) {
    try {
      const user = await User.findOne({ email: auth.username });
      if (!user) {
        return callback(new Error('Invalid username or password'));
      }
      
      const isMatch = await bcrypt.compare(auth.password, user.passwordHash);
      if (!isMatch) {
        return callback(new Error('Invalid username or password'));
      }
      
      // Attach user to session for later use
      session.user = user;
      callback(null, { user: user.email });
    } catch (err) {
      logger.error('Auth Error', err);
      callback(new Error('Authentication failed'));
    }
  },

  // Data Handler
  async onData(stream, session, callback) {
    try {
      // 1. Generate a unique key for S3
      const storageKey = `${Date.now()}-${uuidv4()}.eml`;
      
      // 2. We need to split the stream: one for parsing, one for saving to S3
      // Since streams are consumed once, we might need to buffer or use a PassThrough
      // But mailparser can take a buffer or stream.
      // S3 upload also takes a stream.
      // Let's parse first to get metadata, then save? 
      // Or save raw stream to S3 and parse in parallel?
      // Ideally we save the RAW message to S3.
      
      // Simple approach: Buffer it (memory heavy but easiest for MVP)
      // Better approach: PassThrough streams.
      
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        
        // Save to S3
        await saveMessageBody(storageKey, buffer, buffer.length);
        
        // Parse Metadata
        const parsed = await simpleParser(buffer);
        
        // Determine recipient User (for incoming mail)
        // For this MVP, we treat all incoming mail as if it belongs to the authenticated user (Sent) 
        // OR if it's incoming from outside, we need to find the local user in 'To'.
        
        // Logic:
        // If session.user exists (Authenticated), it's likely an OUTGOING email (save to Sent).
        // If unauthenticated (incoming from other server), we look at RCPT TO.
        
        // For now, let's assume we are receiving mail for a local user.
        // We need to look at the Envelope To (session.envelope.rcptTo)
        
        const recipients = session.envelope.rcptTo;
        
        for (const recipient of recipients) {
          const localUser = await User.findOne({ email: recipient.address });
          
          if (localUser) {
            // Find Inbox folder
            const inbox = await Folder.findOne({ user: localUser._id, type: 'inbox' });
            
            if (inbox) {
              await Message.create({
                user: localUser._id,
                folder: inbox._id,
                from: {
                  name: parsed.from?.text || '',
                  address: parsed.from?.value?.[0]?.address || ''
                },
                to: parsed.to?.value || [],
                subject: parsed.subject,
                snippet: parsed.text?.substring(0, 100),
                storageKey: storageKey,
                size: buffer.length,
                flags: { read: false }
              });
              logger.info(`Message delivered to ${recipient.address}`);
            }
          }
        }
        
        callback();
      });
      
    } catch (err) {
      logger.error('Data Error', err);
      callback(new Error('Message rejected'));
    }
  }
});

const PORT = 2525;
server.listen(PORT, () => {
  console.log(`SMTP Server running on port ${PORT}`);
});
