// Controller for video upload, fetch, update, like/dislike, and delete APIs

import VideoModel from '../models/videoModel.js';
import ChannelModel from '../models/channelModel.js';
import UserModel from '../models/userModel.js';

// Upload a new video (protected route)
export const uploadVideo = async (req, res) => {
  try {
    const { title, description, videoLink, thumbnail, category } = req.body;

    // Find channel of logged-in user
    const channel = await ChannelModel.findOne({ owner: req.user.id });

    // Create new video document
    const video = await VideoModel.create({
      title,
      description,
      videoLink,
      thumbnail,
      category,
      channel: channel._id
    });

    // Add video to channel's videos array
    channel.videos.push(video._id);
    await channel.save();

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all videos (public)
export const getAllVideos = async (req, res) => {
  try {
    const videos = await VideoModel.find().populate('channel');
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get video by ID (public)
export const getVideoById = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id)
      .populate('channel')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'username avatar' }
      });

    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all videos for a channel (public)
export const getVideosByChannel = async (req, res) => {
  try {
    const videos = await VideoModel.find({ channel: req.params.channelId });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a video (protected, only channel owner)
export const deleteVideo = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    const channel = await ChannelModel.findById(video.channel);
    if (channel.owner.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    await VideoModel.findByIdAndDelete(video._id);
    await ChannelModel.findByIdAndUpdate(channel._id, {
      $pull: { videos: video._id }
    });

    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Like a video (protected)
export const likeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    // If already liked, do nothing
    if (video.likedBy.includes(userId)) {
      return res.json({ likes: video.likes, dislikes: video.dislikes });
    }

    // Remove dislike if present
    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy.pull(userId);
      video.dislikes = Math.max(0, video.dislikes - 1);
    }

    video.likedBy.push(userId);
    video.likes += 1;

    // Add to user's likedVideos if not present
    if (!user.likedVideos) user.likedVideos = [];
    if (!user.likedVideos.includes(video._id)) {
      user.likedVideos.push(video._id);
    }

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Unlike a video (protected)
export const unlikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    if (video.likedBy.includes(userId)) {
      video.likedBy.pull(userId);
      video.likes = Math.max(0, video.likes - 1);
    }

    // Remove from user's likedVideos
    if (user.likedVideos && user.likedVideos.includes(video._id)) {
      user.likedVideos.pull(video._id);
    }

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Dislike a video (protected)
export const dislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);
    const user = await UserModel.findById(userId);

    if (!video || !user) return res.status(404).json({ message: "Video or user not found" });

    // If already disliked, do nothing
    if (video.dislikedBy.includes(userId)) {
      return res.json({ likes: video.likes, dislikes: video.dislikes });
    }

    // Remove like if present
    if (video.likedBy.includes(userId)) {
      video.likedBy.pull(userId);
      video.likes = Math.max(0, video.likes - 1);
      // Remove from user's likedVideos
      if (user.likedVideos && user.likedVideos.includes(video._id)) {
        user.likedVideos.pull(video._id);
      }
    }

    video.dislikedBy.push(userId);
    video.dislikes += 1;

    await video.save();
    await user.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove dislike from a video (protected)
export const undislikeVideo = async (req, res) => {
  try {
    const userId = req.user.id;
    const video = await VideoModel.findById(req.params.id);

    if (!video) return res.status(404).json({ message: "Video not found" });

    if (video.dislikedBy.includes(userId)) {
      video.dislikedBy.pull(userId);
      video.dislikes = Math.max(0, video.dislikes - 1);
    }

    await video.save();

    res.json({ likes: video.likes, dislikes: video.dislikes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update video details (protected, only channel owner)
export const updateVideo = async (req, res) => {
  try {
    const video = await VideoModel.findById(req.params.id);
    if (!video) return res.status(404).json({ message: "Video not found" });

    // Only channel owner can edit
    const channel = await ChannelModel.findById(video.channel);
    if (!channel || channel.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Update fields
    const fields = ["title", "description", "videoLink", "thumbnail", "category"];
    fields.forEach(field => {
      if (req.body[field] !== undefined) video[field] = req.body[field];
    });

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};