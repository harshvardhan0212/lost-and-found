// src/models/User.js
// This defines the shape of a User document in MongoDB.
// Mongoose uses this "schema" to validate and structure data.

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Name is mandatory
    },
    email: {
      type: String,
      required: true,
      unique: true, // No two users can have the same email
    },
    password: {
      type: String,
      required: true, // We'll store a hashed version of the password
    },
    isAdmin: {
      type: Boolean,
      default: false, // Normal users are not admin by default
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Export the model so controllers can use it
module.exports = mongoose.model("User", userSchema);
