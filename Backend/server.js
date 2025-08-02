import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import userRoutes from './routes/UserRoutes.js';
import videoRoutes from './routes/videosRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import channelRoutes from './routes/channelRoutes.js';

dotenv.config();
const app = new express();

app.listen(process.env.PORT, () => {
    console.log(`server is running at port: ${process.env.PORT}`);
});

app.use(cors());
app.use(express.json());

userRoutes(app);
videoRoutes(app);
commentRoutes(app);
channelRoutes(app);

app.get('/', (req, res) => {
  res.send('YouTube Clone API is running...');
});

const db = mongoose.connect(process.env.MONGO_URI);
db.then(()=>console.log('database connected successfully!'))
  .catch(err=>console.log('database could not be connected: ', err));