const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    secure_url: String,
    public_id: String,
    type: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    }
  },
  text: {
    type: String,
    default: '',
    maxlength: 500
  },
  poll: {
    question: String,
    options: [{
      text: String,
      votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    }]
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

storySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Story', storySchema);
