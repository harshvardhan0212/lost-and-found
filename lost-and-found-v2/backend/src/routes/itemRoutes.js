// src/routes/itemRoutes.js
// Routes for Lost/Found items.

const express = require("express");
const router = express.Router();
const { createItem, getAllItems, getItemById } = require("../controllers/itemController");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/items → public, anyone can see all items
router.get("/", getAllItems);

// GET /api/items/:id → public, get a single item by ID
router.get("/:id", getItemById);

// POST /api/items → protected, only logged-in users can post items
// "protect" middleware runs first to verify the JWT token
router.post("/", protect, createItem);

module.exports = router;
