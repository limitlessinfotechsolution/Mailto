import mongoose from 'mongoose';

const calendarEventSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  allDay: { type: Boolean, default: false },
  location: { type: String },
  attendees: [{
    email: String,
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' }
  }],
  recurrence: { type: String }, // RRule string
  reminders: [{
    method: { type: String, enum: ['email', 'popup'], default: 'popup' },
    minutes: { type: Number, default: 15 }
  }]
}, { timestamps: true });

export const CalendarEvent = mongoose.model('CalendarEvent', calendarEventSchema);
