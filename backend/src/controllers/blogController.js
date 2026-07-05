const BlogPost = require('../models/BlogPost');

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, cover, tags } = req.body;

    const words = content.split(/\s+/).length;
    const readTime = `${Math.max(1, Math.ceil(words / 200))} min`;

    const post = await BlogPost.create({
      user: req.user._id,
      title,
      content,
      excerpt: excerpt || content.substring(0, 200) + '...',
      category: category || 'stories',
      cover: cover || { secure_url: '', public_id: '' },
      tags: tags || [],
      readTime
    });

    const populated = await BlogPost.findById(post._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create blog post error:', error.message);
    res.status(500).json({ message: error.message || 'Error al crear el artículo' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { category, sort, search } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'popular') sortOption = { 'likes.length': -1 };
    if (sort === 'featured') sortOption = { featured: -1, createdAt: -1 };

    const posts = await BlogPost.find(query)
      .sort(sortOption)
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar')
      .limit(50);

    res.json(posts);
  } catch (error) {
    console.error('Get blog posts error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener artículos' });
  }
};

exports.getPost = async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate('user', 'name username avatar')
      .populate('comments.user', 'name username avatar');

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get blog post error:', error.message);
    res.status(500).json({ message: error.message || 'Error al obtener el artículo' });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    const updated = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('user', 'name username avatar');

    res.json(updated);
  } catch (error) {
    console.error('Update blog post error:', error.message);
    res.status(500).json({ message: error.message || 'Error al actualizar' });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    await BlogPost.findByIdAndDelete(req.params.id);

    res.json({ message: 'Artículo eliminado' });
  } catch (error) {
    console.error('Delete blog post error:', error.message);
    res.status(500).json({ message: error.message || 'Error al eliminar' });
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    const userIndex = post.likes.indexOf(req.user._id);
    if (userIndex === -1) {
      post.likes.push(req.user._id);
    } else {
      post.likes.splice(userIndex, 1);
    }

    await post.save();

    res.json({ likes: post.likes.length, liked: userIndex === -1 });
  } catch (error) {
    console.error('Like blog post error:', error.message);
    res.status(500).json({ message: error.message || 'Error al dar like' });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await BlogPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    post.comments.push({
      user: req.user._id,
      content
    });

    await post.save();

    const updated = await BlogPost.findById(req.params.id)
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
    const post = await BlogPost.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: 'Artículo no encontrado' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'No autorizado' });
    }

    post.comments.pull(req.params.commentId);
    await post.save();

    res.json({ message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Delete comment error:', error.message);
    res.status(500).json({ message: error.message || 'Error al eliminar comentario' });
  }
};
