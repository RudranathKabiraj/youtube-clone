import express from 'express';
import {
  uploadVideo,
  getAllVideos,
  getVideoById,
  getVideosByChannel,
  deleteVideo,
  likeVideo,
  unlikeVideo,
  dislikeVideo,
  undislikeVideo,
  updateVideo
} from '../controllers/videoController.js';
import { protect } from '../middleware/auth.js'; // import controllers

function videoRoutes(app) {
    app.post('/api/video', protect, uploadVideo);          // upload a video (protected with JWT)
    app.get('/api/videos', getAllVideos);                  // fetch all videos
    app.get('/api/video/:id', getVideoById);               // fetch video details by :id
    app.get('/api/videos/:channelId', getVideosByChannel); // fetch all videos of from a channel
    app.delete('/api/video/:id', protect, deleteVideo);    // delete a video (protected with JWT)
    app.put('/api/video/:id', protect, updateVideo);       // update a video details endpoint

    // Like/dislike endpoints
    app.patch('/api/video/:id/like', protect, likeVideo);           // like a video (protected with JWT)
    app.patch('/api/video/:id/unlike', protect, unlikeVideo);       // unLike a video (protected with JWT)
    app.patch('/api/video/:id/dislike', protect, dislikeVideo);     // dislike a video (protected with JWT)
    app.patch('/api/video/:id/undislike', protect, undislikeVideo); // unDislike a video (protected with JWT)
}

export default videoRoutes; // export routes