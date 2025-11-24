import mongoose from 'mongoose';

const domainSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  dkimKey: { type: String },
  dkimSelector: { type: String },
  settings: {
    maxUsers: { type: Number, default: 10 },
    maxQuotaPerUser: { type: Number, default: 1024 * 1024 * 1024 }, // 1GB
  },
  dns: {
    mx: { type: Boolean, default: false },
    spf: { type: Boolean, default: false },
    dkim: { type: Boolean, default: false },
    dmarc: { type: Boolean, default: false }
  },
  dedicatedIp: { type: String },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export const Domain = mongoose.model('Domain', domainSchema);
