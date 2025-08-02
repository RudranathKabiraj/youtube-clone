import mongoose from "mongoose";

// define schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String 
    },
    likedVideos: [{
        type: mongoose.Schema.Types.ObjectId, // array of video _IDs
        ref: 'Video'
    }],
    subscribedChannels: [{ 
        type: mongoose.Schema.Types.ObjectId, // array of channel _IDs
        ref: 'Channel' 
    }],
    channel: { 
        type: mongoose.Schema.Types.ObjectId, // channel _id
        ref: 'Channel',
        default: null
    }
}, { timestamps: true }); // save timestamp

const UserModel = mongoose.models.User || mongoose.model('User', userSchema); // create model based on the schema

export default UserModel; // export model