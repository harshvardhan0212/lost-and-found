// src/routes/authRoutes.js
// This file maps HTTP requests to the correct controller functions.

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/register → calls registerUser controller
router.post("/register", registerUser);

// POST /api/auth/login → calls loginUser controller
router.post("/login", loginUser);

module.exports = router;
