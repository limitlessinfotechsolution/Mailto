import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  company: { type: String },
  notes: { type: String },
  tags: [{ type: String }],
  avatar: { type: String } // URL to avatar
}, { timestamps: true });

// Ensure unique email per user's contact list
contactSchema.index({ user: 1, email: 1 }, { unique: true });

export const Contact = mongoose.model('Contact', contactSchema);
