const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
  likePost,
  addComment,
  deleteComment
} = require('../controllers/blogController');
const auth = require('../middlewares/auth');

router.get('/', auth, getPosts);
router.post('/', auth, createPost);
router.get('/:id', auth, getPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comments', auth, addComment);
router.delete('/:postId/comments/:commentId', auth, deleteComment);

module.exports = router;
