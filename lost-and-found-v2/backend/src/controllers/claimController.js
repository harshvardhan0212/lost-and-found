// src/controllers/claimController.js
// Handles item claim creation and user claim retrieval with strict single-claim validation.

const Claim = require("../models/Claim");
const Item = require("../models/Item");

// -----------------------------------------------
// @route   POST /api/claims
// @desc    Claim a lost/found item (strictly max 1 claim per item per user)
// @access  Protected (requires JWT)
// -----------------------------------------------
const createClaim = async (req, res) => {
  const { itemId, message } = req.body;

  try {
    if (!itemId) {
      return res.status(400).json({ message: "Item ID is required to submit a claim." });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Rule 1: A user cannot claim an item they reported themselves
    if (item.reportedBy && item.reportedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({
        message: "You cannot claim an item that you reported yourself.",
      });
    }

    // Rule 2: Strictly enforce NO ONE can claim the same item more than 1 time
    const existingClaim = await Claim.findOne({
      item: itemId,
      claimedBy: req.user._id,
    });

    if (existingClaim) {
      return res.status(400).json({
        message: "You have already claimed this item. You cannot claim more than 1 time.",
      });
    }

    // Rule 3: Check if this item is already claimed and approved
    const approvedClaim = await Claim.findOne({
      item: itemId,
      status: "approved",
    });

    if (approvedClaim) {
      return res.status(400).json({
        message: "This item has already been successfully claimed and resolved.",
      });
    }

    const claim = await Claim.create({
      item: itemId,
      claimedBy: req.user._id,
      message: message || "",
    });

    res.status(201).json(claim);
  } catch (error) {
    // Handle MongoDB unique constraint error code 11000 gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already claimed this item. You cannot claim more than 1 time.",
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/claims/my
// @desc    Get all claims submitted by the logged-in user
// @access  Protected (requires JWT)
// -----------------------------------------------
const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate("item")
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createClaim, getMyClaims };
