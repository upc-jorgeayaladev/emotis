const express = require('express');
const router = express.Router();
const { addComment, getComments, deleteComment } = require('../controllers/commentController');
const auth = require('../middlewares/auth');

router.get('/:postId', auth, getComments);
router.post('/:postId', auth, addComment);
router.delete('/:id', auth, deleteComment);

module.exports = router;
