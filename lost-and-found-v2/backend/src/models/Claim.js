// src/models/Claim.js
// Schema for item claims with database-level uniqueness per user and item.

const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    message: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Enforce at the database level: no user can claim the same item more than 1 time
claimSchema.index({ item: 1, claimedBy: 1 }, { unique: true });

module.exports = mongoose.model("Claim", claimSchema);
