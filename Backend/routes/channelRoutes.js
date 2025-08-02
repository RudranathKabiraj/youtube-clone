import express from 'express';
import {
  createChannel,
  getChannelById,
  getChannelByUser,
  updateChannel,
  deleteChannel,
  subscribeToChannel,
  unsubscribeFromChannel
} from '../controllers/channelController.js'; // import all controllers
import { protect } from '../middleware/auth.js'; // import auth middleware

function channelRoutes(app) {
  app.post('/api/channel', protect, createChannel); // create channel
  app.get('/api/channel/:id', getChannelById);      // get by channel ID
  app.get('/api/userChannel/:userId', getChannelByUser); // get by user ID
  app.put('/api/updateChannel/:id', protect, updateChannel); // update
  app.delete('/api/deleteChannel/:id', protect, deleteChannel); // delete

  // NEW: subscribe/unsubscribe routes
  app.patch('/api/channel/:id/subscribe', protect, subscribeToChannel);
  app.patch('/api/channel/:id/unsubscribe', protect, unsubscribeFromChannel);
}

export default channelRoutes;
