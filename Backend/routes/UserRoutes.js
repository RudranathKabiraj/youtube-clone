import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile
} from '../controllers/userController.js'; // import controllers

function userRoutes(app) {
    app.post('/api/register', registerUser); // register a new user
    app.post('/api/login', loginUser);       // user login (sends JWT token)
    app.get('/api/profile', getUserProfile); // get details of a user (requires JWT)
}

export default userRoutes; // export routes