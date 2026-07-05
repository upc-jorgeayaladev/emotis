const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  type: {
    type: String,
    enum: ['birthday', 'anniversary', 'other'],
    default: 'other'
  },
  reminder: {
    type: Boolean,
    default: true
  },
  reminderDays: {
    type: Number,
    default: 7
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Calendar', calendarSchema);
