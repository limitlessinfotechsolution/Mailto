import { Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { Campaign, Message, Folder, logger } from '@mailo/shared';

// Redis Connection
const connection = new IORedis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Queue for sending emails
export const emailQueue = new Queue('email-campaigns', { connection });

// Worker to process jobs
const worker = new Worker('email-campaigns', async (job) => {
  // Handle Unsnooze
  if (job.name === 'unsnooze-email') {
    const { messageId, userId } = job.data;
    try {
      const inbox = await Folder.findOne({ user: userId, type: 'inbox' });
      if (inbox) {
        await Message.findByIdAndUpdate(messageId, { 
          folder: inbox._id,
          'flags.read': false 
        });
        logger.info(`Message ${messageId} unsnoozed to Inbox`);
      }
      return;
    } catch (err) {
      logger.error(`Failed to unsnooze message ${messageId}`, err);
      throw err;
    }

  // Handle Campaigns (Existing Logic)
  const { campaignId, recipient } = job.data;
  
  try {
    // Get campaign details
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Import and use mailer
    const { sendEmail } = await import('./mailer.js');
    
    // Send the actual email
    await sendEmail({
      to: recipient,
      subject: campaign.subject,
      html: campaign.content
    });
    
    logger.info(`Campaign ${campaignId} sent to ${recipient}`);
    
    // Update stats (atomic increment)
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { 'stats.sent': 1 } });
    
  } catch (err) {
    logger.error(`Failed to send to ${recipient}`, err);
    await Campaign.findByIdAndUpdate(campaignId, { $inc: { 'stats.failed': 1 } });
  }
}
}, { connection });

worker.on('completed', job => {
  logger.info(`Job ${job.id} completed`);
});

worker.on('failed', (job, err) => {
  logger.error(`Job ${job.id} failed`, err);
});

export const scheduleCampaign = async (campaignId) => {
  const campaign = await Campaign.findById(campaignId);
  if (!campaign) return;

  campaign.status = 'sending';
  await campaign.save();

  // Add jobs to queue
  const jobs = campaign.recipients.map(recipient => ({
    name: 'send-email',
    data: { campaignId: campaign._id, recipient }
  }));

  await emailQueue.addBulk(jobs);
};
