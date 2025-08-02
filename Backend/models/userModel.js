import mongoose from "mongoose";

// Define schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
        trim: true,
        default: 'https://placehold.co/80x80.png?text=Profile', // Default avatar URL
    },
    likedVideos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video',
    }],
    subscribedChannels: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
    }],
    channel: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel',
        default: null,
    },
}, { timestamps: true });

// Ensure unique index on email for better performance
userSchema.index({ email: 1 }, { unique: true });

// Create model
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

// Export model
export default UserModel;