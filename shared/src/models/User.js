import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: { type: String, required: true },
  domain: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Domain',
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'domain_admin', 'user'],
    default: 'user'
  },
  quota: {
    limit: { type: Number, default: 1024 * 1024 * 1024 }, // Bytes
    used: { type: Number, default: 0 }
  },
  twoFactorAuth: {
    enabled: { type: Boolean, default: false },
    secret: { type: String },
    backupCodes: [{ type: String }]
  },
  signature: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
