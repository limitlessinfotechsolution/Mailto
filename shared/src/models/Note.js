import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  content: { type: String, required: true },
  color: { type: String, default: '#ffffff' },
  isPinned: { type: Boolean, default: false },
  tags: [{ type: String }]
}, { timestamps: true });

export const Note = mongoose.model('Note', noteSchema);
