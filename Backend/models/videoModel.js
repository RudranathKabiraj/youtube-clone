import mongoose from "mongoose";

// define schema
const videoSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    videoLink: { 
        type: String, 
        required: true 
    },
    thumbnail: { 
        type: String 
    },
    views: { 
        type: Number, 
        default: 0 
    },
    likes: { 
        type: Number, 
        default: 0 
    },
    dislikes: { 
        type: Number, 
        default: 0 
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId, // array of user _IDs
        ref: "User"
    }],
    dislikedBy: [{
        type: mongoose.Schema.Types.ObjectId, // array of user _IDs
        ref: "User"
    }],
    uploadDate: { 
        type: Date, 
        default: Date.now // upload date
    },
    category: { 
        type: String 
    },
    channel: {
        type: mongoose.Schema.Types.ObjectId, // channel _id
        ref: "Channel",
        required: true,
    },
    comments: [{ 
        type: mongoose.Schema.Types.ObjectId, // array of comment _IDs
        ref: "Comment" 
    }],
},{ timestamps: true }); // save timestamp

const VideoModel = mongoose.model("Video", videoSchema); // create model based on the schema

export default VideoModel; // export model