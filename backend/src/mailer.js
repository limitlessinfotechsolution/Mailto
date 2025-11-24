import nodemailer from 'nodemailer';
import { logger } from '@mailo/shared';

// Create reusable transporter
let transporter = null;

export const initMailer = () => {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'localhost',
    port: parseInt(process.env.SMTP_PORT || '2525'),
    secure: false, // true for 465, false for other ports
    auth: process.env.SMTP_USER ? {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    } : undefined,
    tls: {
      rejectUnauthorized: false // For development with self-signed certs
    }
  });

  logger.info('Nodemailer transporter initialized');
};

export const sendEmail = async ({ from, to, subject, text, html, attachments = [] }) => {
  if (!transporter) {
    throw new Error('Mailer not initialized. Call initMailer() first.');
  }

  try {
    const mailOptions = {
      from: from || process.env.DEFAULT_FROM_EMAIL || 'noreply@mailo.local',
      to,
      subject,
      text,
      html
    };

    // Add attachments if provided
    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments.map(att => ({
        filename: att.filename,
        path: att.path || undefined,
        content: att.content || undefined,
        contentType: att.contentType || undefined
      }));
    }

    const info = await transporter.sendMail(mailOptions);

    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Failed to send email:', error);
    throw error;
  }
};

