import express from 'express';
import {
  addComment,
  getCommentsByVideo,
  deleteComment,
  editComment
} from '../controllers/commentController.js'; // import controllers
import { protect } from '../middleware/auth.js';

function commentRoutes(app) {
    app.post('/api/comment', protect, addComment); // add a new comment
    app.get('/api/comment/:videoId', getCommentsByVideo); // get comments on a video by videoId
    app.delete('/api/comment/:id', protect, deleteComment); // delete a comment (protected with JWT)
    app.patch('/api/comment/:id', protect, editComment); // edit a comment (protected with JWT)
}

export default commentRoutes; // export routes