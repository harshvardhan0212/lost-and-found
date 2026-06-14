// src/routes/claimRoutes.js
// Routes for claims.

const express = require("express");
const router = express.Router();
const { createClaim } = require("../controllers/claimController");
const { protect } = require("../middlewares/authMiddleware");

// POST /api/claims → protected, only logged-in users can claim an item
router.post("/", protect, createClaim);

module.exports = router;
