import CommentModel from '../models/commentModel.js';
import VideoModel from '../models/videoModel.js';

// Add a new comment to a video (protected)
export const addComment = async (req, res) => {
  try {
    const { text, videoId } = req.body;

    // Create comment document
    const comment = await CommentModel.create({
      user: req.user.id,
      video: videoId,
      text
    });

    // Add comment to video's comments array
    await VideoModel.findByIdAndUpdate(videoId, {
      $push: { comments: comment._id }
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all comments for a video (public)
export const getCommentsByVideo = async (req, res) => {
  try {
    const comments = await CommentModel.find({ video: req.params.videoId })
      .populate('user', 'username avatar');
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a comment (protected, only comment owner)
export const deleteComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (!comment.user || !comment.user.equals(req.user.id)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Remove reference from video
    await VideoModel.findByIdAndUpdate(comment.video, {
      $pull: { comments: comment._id }
    });

    // Delete the comment
    await CommentModel.findByIdAndDelete(comment._id);

    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Edit a comment (protected, only comment owner)
export const editComment = async (req, res) => {
  try {
    const comment = await CommentModel.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: "Comment not found" });

    if (comment.user.toString() !== req.user.id)
      return res.status(403).json({ message: "Unauthorized" });

    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};