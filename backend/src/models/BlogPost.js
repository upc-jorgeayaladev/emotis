const mongoose = require('mongoose');

const blogCommentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    maxlength: 1000
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const blogPostSchema = new mongoose.Schema({
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
  excerpt: {
    type: String,
    maxlength: 500
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido']
  },
  cover: {
    secure_url: String,
    public_id: String
  },
  category: {
    type: String,
    enum: ['stories', 'tips', 'tutorials', 'inspiration'],
    default: 'stories'
  },
  readTime: {
    type: String,
    default: '5 min'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [blogCommentSchema],
  tags: [String],
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BlogPost', blogPostSchema);
