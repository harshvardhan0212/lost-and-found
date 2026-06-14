// backend/createAdmin.js
// Run this ONCE to create an admin user in the database.
// Usage: node createAdmin.js
//
// After running, login with:
//   Email:    admin@lostandfound.com
//   Password: admin123

const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const User     = require("./src/models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected...");

    // Check if admin already exists
    const existing = await User.findOne({ email: "admin@lostandfound.com" });
    if (existing) {
      console.log("Admin user already exists!");
      process.exit();
    }

    // Hash password and create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@lostandfound.com",
      password: hashedPassword,
      isAdmin: true,   // ← This makes the user an admin
    });

    console.log("✅ Admin user created successfully!");
    console.log("   Email:    admin@lostandfound.com");
    console.log("   Password: admin123");
    process.exit();
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

createAdmin();
