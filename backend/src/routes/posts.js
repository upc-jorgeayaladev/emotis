const express = require('express');
const router = express.Router();
const { 
  createPost, 
  getFeed, 
  getPostsByUser, 
  deletePost,
  reactToPost 
} = require('../controllers/postController');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.get('/', auth, getFeed);
router.post('/', auth, upload.array('images', 5), createPost);
router.get('/user/:username', auth, getPostsByUser);
router.delete('/:id', auth, deletePost);
router.post('/:id/react', auth, reactToPost);

module.exports = router;
