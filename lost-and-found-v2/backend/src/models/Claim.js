// src/models/Claim.js
// This defines a Claim — when a user says "this item is mine."

const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    // Which item is being claimed
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    // Who is claiming the item
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Claim status — starts as "pending", could later be "approved" or "rejected"
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // Default is always pending
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Claim", claimSchema);
