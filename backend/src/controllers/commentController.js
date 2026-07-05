const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.addComment = async (req, res) => {
  try {
    const { content } = req.body;

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = await Comment.create({
      user: req.user._id,
      post: req.params.id,
      content
    });

    post.comments.push(comment._id);
    await post.save();

    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        to: post.user,
        from: req.user._id,
        type: 'comment',
        post: post._id
      });
    }

    const populatedComment = await Comment.findById(comment._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name username avatar');

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const post = await Post.findById(comment.post);
    post.comments = post.comments.filter(
      id => id.toString() !== comment._id.toString()
    );
    await post.save();

    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
