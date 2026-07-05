const express = require('express');
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestion,
  addAnswer,
  voteQuestion,
  voteAnswer,
  deleteQuestion
} = require('../controllers/questionController');
const auth = require('../middlewares/auth');

router.get('/', auth, getQuestions);
router.post('/', auth, createQuestion);
router.get('/:id', auth, getQuestion);
router.delete('/:id', auth, deleteQuestion);
router.post('/:id/vote', auth, voteQuestion);
router.post('/:id/answers', auth, addAnswer);
router.post('/:questionId/answers/:answerId/vote', auth, voteAnswer);

module.exports = router;
