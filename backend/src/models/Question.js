const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'El contenido es requerido'],
    maxlength: 2000
  },
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

const questionSchema = new mongoose.Schema({
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
  content: {
    type: String,
    required: [true, 'La descripción es requerida'],
    maxlength: 5000
  },
  category: {
    type: String,
    enum: ['birthday', 'wedding', 'anniversary', 'graduation', 'christmas', 'mothers_day', 'valentines', 'corporate', 'romantic', 'other'],
    default: 'other'
  },
  tags: [String],
  answers: [answerSchema],
  votes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  solved: {
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

module.exports = mongoose.model('Question', questionSchema);
