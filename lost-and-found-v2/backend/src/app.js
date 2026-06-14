// src/app.js
// This file sets up the Express app:
// - Connects middlewares (JSON parsing, CORS)
// - Registers all routes
// - Connects to MongoDB

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

// Import route files
const authRoutes = require("./routes/authRoutes");
const itemRoutes = require("./routes/itemRoutes");
const claimRoutes = require("./routes/claimRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Connect to MongoDB
connectDB();

// --- Middlewares ---
app.use(cors());           // Allow cross-origin requests (needed for React frontend)
app.use(express.json());   // Parse incoming JSON request bodies

// --- Routes ---
// All auth routes start with /api/auth
app.use("/api/auth", authRoutes);

// All item routes start with /api/items
app.use("/api/items", itemRoutes);

// All claim routes start with /api/claims
app.use("/api/claims", claimRoutes);

// All admin routes start with /api/admin (protected + admin only)
app.use("/api/admin", adminRoutes);

// Simple root route to confirm server is running
app.get("/", (req, res) => {
  res.send("Lost and Found API is running!");
});

module.exports = app;
