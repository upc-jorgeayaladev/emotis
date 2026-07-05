const express = require('express');
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  followUser, 
  unfollowUser,
  searchUsers 
} = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/search', auth, searchUsers);
router.get('/:username', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.post('/follow/:id', auth, followUser);
router.delete('/follow/:id', auth, unfollowUser);

module.exports = router;
