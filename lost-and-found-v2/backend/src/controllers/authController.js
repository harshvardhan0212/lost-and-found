// src/controllers/authController.js
// This file contains the logic for user registration and login.
// Controllers handle the "what happens when this route is called" logic.

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to generate a JWT token for a given user ID
const generateToken = (id) => {
  return jwt.sign(
    { id },                          // Payload: we store the user's ID
    process.env.JWT_SECRET,          // Secret key from .env
    { expiresIn: "7d" }              // Token expires in 7 days
  );
};

// -----------------------------------------------
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// -----------------------------------------------
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with this email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password before saving (10 = salt rounds, higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Respond with user info and a JWT token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   POST /api/auth/login
// @desc    Login a user and return JWT
// @access  Public
// -----------------------------------------------
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If user not found OR password doesn't match
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Return user info with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser };
