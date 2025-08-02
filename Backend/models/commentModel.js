import mongoose from "mongoose";

// define schema
const commentSchema = new mongoose.Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, // user _id
        ref: "User", 
        required: true 
    },
    video: {
      type: mongoose.Schema.Types.ObjectId, // video _id
      ref: "Video",
      required: true,
    },
    text: { 
        type: String, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
}, { timestamps: true }); // save timestamp

const CommentModel = mongoose.model("Comment", commentSchema); // create model based on the schema

export default CommentModel; // export model