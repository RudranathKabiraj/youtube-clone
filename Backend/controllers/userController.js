// Controller for user registration, login, and profile APIs

import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Helper to generate JWT token for a user
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Register a new user
export const registerUser = async (req, res) => {
    try {
        const { username, email, password, avatar } = req.body;

        // Validate required fields
        if (!username) {
            res.status(400).json({ message: "Username is required." });
        }
        if (!email) {
            res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            res.status(400).json({ message: "Password is required." });
        }
        if (!avatar) {
            res.status(400).json({ message: "Avatar is required." });
        }

        // Trim inputs and validate
        const trimmedUsername = username.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        const trimmedAvatar = avatar.trim();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(trimmedEmail)) {
        return res.status(400).json({ message: "Invalid email format." });
        }

        // Validate password strength
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{6,}$/;
        if (!passwordRegex.test(trimmedPassword)) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long and include 1 uppercase, 1 lowercase, 1 number, and 1 special character.",
        });
        }

        // Check if user already exists
        const userExists = await UserModel.findOne({ email: trimmedEmail });
        if (userExists) {
        return res.status(400).json({ message: "User already exists" });
        }

        // Hash password and create user
        const hashed = await bcrypt.hash(trimmedPassword, 10);
        const user = await UserModel.create({
        username: trimmedUsername,
        email: trimmedEmail,
        password: hashed,
        avatar: trimmedAvatar,
        });

        // Respond with user info and JWT token
        res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        channelId: user.channel ? user.channel.toString() : null,
        token: generateToken(user._id),
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// Login user and return JWT token
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email) {
            res.status(400).json({ message: "Email is required." });
        }
        if (!password) {
            res.status(400).json({ message: "Password is required." });
        }

        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: "Wrong password" });
        }

        // Respond with user info and JWT token
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            channelId: user.channel ? user.channel.toString() : null,
            token: generateToken(user._id),
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get user profile (requires JWT)
export const getUserProfile = async (req, res) => {
    try {
        const user = await UserModel.findById(req.user.id).populate("channel");
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            channelId: user.channel ? user.channel._id.toString() : null,
            // add other fields if needed
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
};