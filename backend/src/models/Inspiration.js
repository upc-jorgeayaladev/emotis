const mongoose = require('mongoose');

const inspirationCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    maxlength: 1000
  }
}, {
  timestamps: true
});

const inspirationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'El título es requerido'],
    maxlength: 200
  },
  description: {
    type: String,
    maxlength: 2000
  },
  images: [{
    secure_url: String,
    public_id: String
  }],
  category: {
    type: String,
    enum: ['birthday', 'wedding', 'anniversary', 'graduation', 'christmas', 'mothers_day', 'valentines', 'corporate', 'romantic', 'other'],
    default: 'other'
  },
  tags: [String],
  reactions: {
    emotion: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    inspire: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cry: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    want: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    perfect: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [inspirationCommentSchema],
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Inspiration', inspirationSchema);
