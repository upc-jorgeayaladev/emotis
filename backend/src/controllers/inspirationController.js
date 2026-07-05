const Inspiration = require('../models/Inspiration');
const { uploadToCloudinary } = require('../middlewares/upload');

exports.createInspiration = async (req, res) => {
  try {
    const { title, description, category, tags } = req.body;

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        images.push(result);
      }
    }

    const inspiration = await Inspiration.create({
      user: req.user._id,
      title,
      description: description || '',
      images,
      category: category || 'other',
      tags: tags ? JSON.parse(tags) : []
    });

    const populated = await Inspiration.findById(inspiration._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create inspiration error:', error.message);
    res.status(500).json({ message: error.message || 'Error al crear la inspiración' });
  }
};

exports.getInspirations = async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') {
      sortOption = { 'saves.length': -1, createdAt: -1 };
    }

    const inspirations = await Inspiration.find(query)
      .sort(sortOption)
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar')
      .limit(50);

    res.json(inspirations);
  } catch (error) {
    console.error('Get inspirations error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener inspiraciones' });
  }
};

exports.getInspiration = async (req, res) => {
  try {
    const inspiration = await Inspiration.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar');

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    res.json(inspiration);
  } catch (error) {
    console.error('Get inspiration error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener la inspiración' });
  }
};

exports.deleteInspiration = async (req, res) => {
  try {
    const inspiration = await Inspiration.findById(req.params.id);

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    if (inspiration.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await Inspiration.findByIdAndDelete(req.params.id);

    res.json({ message: 'Inspiración eliminada' });
  } catch (error) {
    console.error('Delete inspiration error:', error.message);
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};

exports.reactInspiration = async (req, res) => {
  try {
    const { reaction } = req.body;
    const validReactions = ['emotion', 'inspire', 'cry', 'want', 'perfect'];

    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Reacción inválida' });
    }

    const inspiration = await Inspiration.findById(req.params.id);

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    const reactionArray = inspiration.reactions[reaction];
    const userIndex = reactionArray.indexOf(req.user._id);

    if (userIndex === -1) {
      reactionArray.push(req.user._id);
    } else {
      reactionArray.splice(userIndex, 1);
    }

    await inspiration.save();

    res.json({ reactions: inspiration.reactions });
  } catch (error) {
    console.error('React inspiration error:', error.message);
    res.status(500).json({ message: error.message || 'Error al reaccionar' });
  }
};

exports.saveInspiration = async (req, res) => {
  try {
    const inspiration = await Inspiration.findById(req.params.id);

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    const userIndex = inspiration.saves.indexOf(req.user._id);

    if (userIndex === -1) {
      inspiration.saves.push(req.user._id);
    } else {
      inspiration.saves.splice(userIndex, 1);
    }

    await inspiration.save();

    res.json({ saved: userIndex === -1, savesCount: inspiration.saves.length });
  } catch (error) {
    console.error('Save inspiration error:', error.message);
    res.status(500).json({ message: error.message || 'Error al guardar' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const inspiration = await Inspiration.findById(req.params.id);

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    inspiration.comments.push({
      user: req.user._id,
      content
    });

    await inspiration.save();

    const updated = await Inspiration.findById(req.params.id)
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar');

    res.json(updated);
  } catch (error) {
    console.error('Add comment error:', error.message);
    res.status(500).json({ message: error.message || 'Error al agregar comentario' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const inspiration = await Inspiration.findById(req.params.inspirationId);

    if (!inspiration) {
      return res.status(404).json({ message: 'Inspiración no encontrada' });
    }

    const comment = inspiration.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    inspiration.comments.pull(req.params.commentId);
    await inspiration.save();

    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: error.message || 'Error al eliminar comentario' });
  }
};
