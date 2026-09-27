// src/models/Item.js
// Defines the schema for Lost and Found items, including category, attributes,
// Cloudinary image references, and reporter relationship.

const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true, // e.g. "Blue Wallet"
      trim: true,
    },
    description: {
      type: String,
      required: true, // e.g. "Found near the cafeteria"
      trim: true,
    },
    category: {
      type: String,
      default: "Other",
      trim: true,
    },
    color: {
      type: String,
      default: "",
      trim: true,
    },
    brand: {
      type: String,
      default: "",
      trim: true,
    },
    location: {
      type: String,
      required: true, // e.g. "Library, 2nd Floor"
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["lost", "found"], // Only "lost" or "found" are allowed
      required: true,
    },
    // Reference to the user who reported this item
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Cloudinary image information
    imageUrl: {
      type: String,
      default: "",
    },
    cloudinaryPublicId: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for fast search across title, description, location, category, color, and brand
itemSchema.index({
  title: "text",
  description: "text",
  location: "text",
  category: "text",
  color: "text",
  brand: "text",
});

module.exports = mongoose.model("Item", itemSchema);
