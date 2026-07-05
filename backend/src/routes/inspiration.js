const express = require('express');
const router = express.Router();
const {
  createInspiration,
  getInspirations,
  getInspiration,
  deleteInspiration,
  reactInspiration,
  saveInspiration,
  addComment,
  deleteComment
} = require('../controllers/inspirationController');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.get('/', auth, getInspirations);
router.post('/', auth, upload.array('images', 5), createInspiration);
router.get('/:id', auth, getInspiration);
router.delete('/:id', auth, deleteInspiration);
router.post('/:id/react', auth, reactInspiration);
router.post('/:id/save', auth, saveInspiration);
router.post('/:id/comments', auth, addComment);
router.delete('/:inspirationId/comments/:commentId', auth, deleteComment);

module.exports = router;
