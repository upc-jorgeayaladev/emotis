const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  avatar: {
    secure_url: String,
    public_id: String
  },
  cover: {
    secure_url: String,
    public_id: String
  },
  bio: {
    type: String,
    default: '',
    maxlength: 500
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  badges: [String],
  wishlist: [{
    name: String,
    url: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
