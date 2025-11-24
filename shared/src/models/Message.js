import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  messageId: { type: String }, // Message-ID header
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Folder',
    required: true
  },
  from: {
    name: String,
    address: { type: String, required: true }
  },
  to: [{
    name: String,
    address: String
  }],
  cc: [{
    name: String,
    address: String
  }],
  bcc: [{
    name: String,
    address: String
  }],
  subject: { type: String },
  snippet: { type: String }, // Short preview
  
  // Storage references
  storageKey: { type: String, required: true }, // S3 Key
  size: { type: Number, required: true },
  
  flags: {
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    answered: { type: Boolean, default: false },
    draft: { type: Boolean, default: false }
  },
  
  headers: { type: Map, of: String }, // Important headers
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    contentId: String
  }]
}, { timestamps: true });

messageSchema.index({ user: 1, folder: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
