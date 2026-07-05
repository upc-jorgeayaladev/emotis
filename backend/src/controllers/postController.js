const Post = require('../models/Post');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { postSchema } = require('../validators/schemas');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middlewares/upload');

exports.createPost = async (req, res) => {
  try {
    const validatedData = postSchema.parse(req.body);

    const images = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file);
        images.push(result);
      }
    }

    const post = await Post.create({
      user: req.user._id,
      description: validatedData.description || '',
      images,
      occasion: validatedData.occasion || 'other',
      giftProduct: validatedData.giftProduct || ''
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error.message);
    if (error.name === 'ZodError') {
      return res.status(400).json({ message: error.errors[0].message });
    }
    res.status(500).json({ message: error.message || 'Error al crear la publicación' });
  }
};

exports.getFeed = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('user', 'name username avatar badges');

    const total = await Post.countDocuments({});

    res.json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPostsByUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const posts = await Post.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name username avatar');

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    for (const image of post.images) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reactToPost = async (req, res) => {
  try {
    const { reaction } = req.body;
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const validReactions = ['emotion', 'inspire', 'cry', 'want', 'perfect'];
    if (!validReactions.includes(reaction)) {
      return res.status(400).json({ message: 'Invalid reaction' });
    }

    const reactionArray = post.reactions[reaction];
    const userIndex = reactionArray.indexOf(req.user._id);

    if (userIndex === -1) {
      reactionArray.push(req.user._id);
      
      if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          to: post.user,
          from: req.user._id,
          type: 'reaction',
          post: post._id
        });
      }
    } else {
      reactionArray.splice(userIndex, 1);
    }

    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
