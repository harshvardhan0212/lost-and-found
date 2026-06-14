// src/models/Item.js
// This defines the shape of a Lost/Found Item in MongoDB.

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // e.g. "Blue Wallet"
    },
    description: {
      type: String,
      required: true, // e.g. "Found near the cafeteria"
    },
    location: {
      type: String,
      required: true, // e.g. "Library, 2nd Floor"
    },
    status: {
      type: String,
      enum: ["lost", "found"], // Only "lost" or "found" are allowed values
      required: true,
    },
    // Reference to the user who reported this item
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId, // Stores the User's MongoDB ID
      ref: "User",                          // Refers to the "User" model
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Item", itemSchema);
