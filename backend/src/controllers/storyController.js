const Story = require('../models/Story');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');
const { uploadToCloudinary } = require('../middlewares/upload');

exports.createStory = async (req, res) => {
  try {
    const { text, poll } = req.body;

    let media = null;
    if (req.file) {
      const result = await uploadToCloudinary(req.file);
      media = {
        secure_url: result.secure_url,
        public_id: result.public_id,
        type: req.file.mimetype.startsWith('video/') ? 'video' : 'image'
      };
    }

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const story = await Story.create({
      user: req.user._id,
      media,
      text,
      poll: poll ? JSON.parse(poll) : undefined,
      expiresAt
    });

    const populatedStory = await Story.findById(story._id)
      .populate('user', 'name username avatar');

    res.status(201).json(populatedStory);
  } catch (error) {
    console.error('Create story error:', error.message);
    res.status(500).json({ message: error.message || 'Error al crear la historia' });
  }
};

exports.getStories = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const followingIds = user.following;
    followingIds.push(req.user._id);

    const stories = await Story.find({
      user: { $in: followingIds },
      expiresAt: { $gt: new Date() }
    })
    .sort({ createdAt: -1 })
    .populate('user', 'name username avatar');

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (story.media && story.media.public_id) {
      await cloudinary.uploader.destroy(story.media.public_id);
    }

    await Story.findByIdAndDelete(req.params.id);

    res.json({ message: 'Story removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const story = await Story.findById(req.params.id);
    
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (!story.poll || !story.poll.options[optionIndex]) {
      return res.status(400).json({ message: 'Invalid poll option' });
    }

    story.poll.options.forEach((option, index) => {
      option.votes = option.votes.filter(
        id => id.toString() !== req.user._id.toString()
      );
    });

    story.poll.options[optionIndex].votes.push(req.user._id);

    await story.save();

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
