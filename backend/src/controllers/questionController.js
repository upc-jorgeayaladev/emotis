const Question = require('../models/Question');

exports.createQuestion = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;

    const question = await Question.create({
      user: req.user._id,
      title,
      content,
      category: category || 'other',
      tags: tags || []
    });

    const populated = await Question.findById(question._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create question error:', error.message);
    res.status(500).json({ message: error.message || 'Error al crear la pregunta' });
  }
};

exports.getQuestions = async (req, res) => {
  try {
    const { category, sort } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { votes: -1 };
    if (sort === 'unanswered') sortOption = { 'answers.length': 1, createdAt: -1 };

    const questions = await Question.find(query)
      .sort(sortOption)
      .populate('user', 'name username avatar')
      .populate('answers.user', 'name username avatar')
      .limit(50);

    res.json(questions);
  } catch (error) {
    console.error('Get questions error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener preguntas' });
  }
};

exports.getQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('user', 'name username avatar')
      .populate('answers.user', 'name username avatar');

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    res.json(question);
  } catch (error) {
    console.error('Get question error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener la pregunta' });
  }
};

exports.addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    question.answers.push({
      user: req.user._id,
      content
    });

    await question.save();

    const updated = await Question.findById(req.params.id)
      .populate('user', 'name username avatar')
      .populate('answers.user', 'name username avatar');

    res.json(updated);
  } catch (error) {
    console.error('Add answer error:', error.message);
    res.status(500).json({ message: error.message || 'Error al agregar respuesta' });
  }
};

exports.voteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    const userIndex = question.votes.indexOf(req.user._id);
    if (userIndex === -1) {
      question.votes.push(req.user._id);
    } else {
      question.votes.splice(userIndex, 1);
    }

    await question.save();

    res.json({ votes: question.votes.length });
  } catch (error) {
    console.error('Vote question error:', error.message);
    res.status(500).json({ message: error.message || 'Error al votar' });
  }
};

exports.voteAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.questionId);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    const answer = question.answers.id(req.params.answerId);
    if (!answer) {
      return res.status(404).json({ message: 'Respuesta no encontrada' });
    }

    const userIndex = answer.votes.indexOf(req.user._id);
    if (userIndex === -1) {
      answer.votes.push(req.user._id);
    } else {
      answer.votes.splice(userIndex, 1);
    }

    await question.save();

    res.json({ votes: answer.votes.length });
  } catch (error) {
    console.error('Vote answer error:', error.message);
    res.status(500).json({ message: error.message || 'Error al votar' });
  }
};

exports.deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Pregunta no encontrada' });
    }

    if (question.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await Question.findByIdAndDelete(req.params.id);

    res.json({ message: 'Pregunta eliminada' });
  } catch (error) {
    console.error('Delete question error:', error.message);
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};
