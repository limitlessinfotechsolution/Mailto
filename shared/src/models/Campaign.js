import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true }, // HTML content
  recipients: [{ type: String }], // List of email addresses or tag query
  status: { 
    type: String, 
    enum: ['draft', 'scheduled', 'sending', 'completed', 'failed'], 
    default: 'draft' 
  },
  scheduledAt: { type: Date },
  stats: {
    sent: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
    opened: { type: Number, default: 0 },
    clicked: { type: Number, default: 0 }
  }
}, { timestamps: true });

export const Campaign = mongoose.model('Campaign', campaignSchema);
