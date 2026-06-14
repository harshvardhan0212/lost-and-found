// src/controllers/claimController.js
// This file handles the logic for claiming an item.

const Claim = require("../models/Claim");
const Item = require("../models/Item");

// -----------------------------------------------
// @route   POST /api/claims
// @desc    Claim a lost/found item
// @access  Protected (requires JWT)
// -----------------------------------------------
const createClaim = async (req, res) => {
  const { itemId } = req.body;

  try {
    // Check if the item actually exists
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check if the logged-in user already claimed this item
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: req.user._id,
    });

    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed this item" });
    }

    // Create the claim with status "pending" (default)
    const claim = await Claim.create({
      item: itemId,
      claimedBy: req.user._id,
    });

    res.status(201).json(claim);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createClaim };
