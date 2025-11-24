import mongoose from 'mongoose';

const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['inbox', 'sent', 'drafts', 'trash', 'junk', 'custom'],
    default: 'custom'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    default: null
  },
  path: { type: String }, // Materialized path for easier querying
  stats: {
    messages: { type: Number, default: 0 },
    unread: { type: Number, default: 0 },
    size: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Compound index for unique folder names per user
folderSchema.index({ user: 1, name: 1, parentId: 1 }, { unique: true });

export const Folder = mongoose.model('Folder', folderSchema);
