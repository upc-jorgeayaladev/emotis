const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    default: '',
    maxlength: 2000
  },
  images: [{
    secure_url: String,
    public_id: String
  }],
  reactions: {
    emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    inspire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    want: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    perfect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],
  occasion: {
    type: String,
    enum: ['birthday', 'wedding', 'anniversary', 'graduation', 'christmas', 'mothers_day', 'valentines', 'other'],
    default: 'other'
  },
  giftProduct: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
