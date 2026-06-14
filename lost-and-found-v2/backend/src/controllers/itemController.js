// src/controllers/itemController.js
// This file handles creating and fetching Lost/Found items.

const Item = require("../models/Item");

// -----------------------------------------------
// @route   POST /api/items
// @desc    Create a new lost/found item
// @access  Protected (requires JWT)
// -----------------------------------------------
const createItem = async (req, res) => {
  const { title, description, location, status } = req.body;

  try {
    // Create the item and link it to the logged-in user
    // req.user is set by the authMiddleware after verifying the JWT
    const item = await Item.create({
      title,
      description,
      location,
      status,
      reportedBy: req.user._id, // ID of the logged-in user
    });

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/items
// @desc    Get all items
// @access  Public
// -----------------------------------------------
const getAllItems = async (req, res) => {
  try {
    // Fetch all items, and populate the "reportedBy" field with user's name and email
    // "populate" replaces the user ID with the actual user object fields
    const items = await Item.find().populate("reportedBy", "name email");
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/items/:id
// @desc    Get a single item by its ID
// @access  Public
// -----------------------------------------------
const getItemById = async (req, res) => {
  try {
    // req.params.id is the :id from the URL
    const item = await Item.findById(req.params.id).populate("reportedBy", "name email");

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createItem, getAllItems, getItemById };
