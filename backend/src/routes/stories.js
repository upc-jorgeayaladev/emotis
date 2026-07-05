const express = require('express');
const router = express.Router();
const { createStory, getStories, deleteStory, votePoll } = require('../controllers/storyController');
const auth = require('../middlewares/auth');
const { upload } = require('../middlewares/upload');

router.get('/', auth, getStories);
router.post('/', auth, upload.single('media'), createStory);
router.delete('/:id', auth, deleteStory);
router.post('/:id/vote', auth, votePoll);

module.exports = router;
