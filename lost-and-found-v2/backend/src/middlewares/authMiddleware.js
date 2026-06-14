// src/middlewares/authMiddleware.js
// This middleware protects routes that require login.
// It checks for a JWT token in the request headers.

const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header exists and starts with "Bearer"
  // Example header: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token (remove "Bearer " prefix)
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the secret key from .env
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find the user by the ID stored in the token, exclude password field
      req.user = await User.findById(decoded.id).select("-password");

      // Call next() to move to the actual route handler
      next();
    } catch (error) {
      // Token is invalid or expired
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  // If no token found in headers
  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

module.exports = { protect };
