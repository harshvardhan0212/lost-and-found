// src/controllers/adminController.js
// Admin-only controllers:
// - Get all claims (with item and user details)
// - Update claim status (approve / reject)
// - Get dashboard stats

const Claim = require("../models/Claim");
const Item  = require("../models/Item");
const User  = require("../models/User");

// -----------------------------------------------
// @route   GET /api/admin/claims
// @desc    Get all claims with full details
// @access  Admin only
// -----------------------------------------------
const getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("item", "title description location status")   // Item details
      .populate("claimedBy", "name email")                     // Claimer details
      .sort({ createdAt: -1 });                                // Newest first

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   PUT /api/admin/claims/:id
// @desc    Approve or reject a claim
// @access  Admin only
// -----------------------------------------------
const updateClaimStatus = async (req, res) => {
  const { status } = req.body; // "approved" or "rejected"

  // Validate the incoming status value
  if (!["approved", "rejected", "pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    // Find the claim by its ID (from URL param)
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Update the status field
    claim.status = status;
    await claim.save();

    res.json({ message: `Claim ${status} successfully`, claim });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/admin/stats
// @desc    Get dashboard summary stats
// @access  Admin only
// -----------------------------------------------
const getDashboardStats = async (req, res) => {
  try {
    // Run all counts in parallel using Promise.all for efficiency
    const [
      totalItems,
      lostItems,
      foundItems,
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalUsers,
    ] = await Promise.all([
      Item.countDocuments(),
      Item.countDocuments({ status: "lost" }),
      Item.countDocuments({ status: "found" }),
      Claim.countDocuments(),
      Claim.countDocuments({ status: "pending" }),
      Claim.countDocuments({ status: "approved" }),
      Claim.countDocuments({ status: "rejected" }),
      User.countDocuments(),
    ]);

    res.json({
      totalItems,
      lostItems,
      foundItems,
      totalClaims,
      pendingClaims,
      approvedClaims,
      rejectedClaims,
      totalUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/admin/items
// @desc    Get all items (admin view with reporter info)
// @access  Admin only
// -----------------------------------------------
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   DELETE /api/admin/items/:id
// @desc    Delete an item (admin only)
// @access  Admin only
// -----------------------------------------------
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    // Also delete all claims related to this item
    await Claim.deleteMany({ item: req.params.id });
    res.json({ message: "Item and related claims deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllClaims,
  updateClaimStatus,
  getDashboardStats,
  getAllItems,
  deleteItem,
};
