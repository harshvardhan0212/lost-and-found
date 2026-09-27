// src/controllers/itemController.js
// Handles Lost and Found item operations, Cloudinary upload, search/filter, and Redis cache management.

const Item = require("../models/Item");
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");
const cloudinaryService = require("../services/cloudinaryService");
const cacheService = require("../services/cacheService");

// -----------------------------------------------
// @route   POST /api/items
// @desc    Create a new lost/found item (with optional Cloudinary image upload)
// @access  Protected (requires JWT)
// -----------------------------------------------
const createItem = async (req, res) => {
  const {
    title,
    description,
    location,
    status,
    category,
    color,
    brand,
    date,
  } = req.body;

  try {
    let imageUrl = "";
    let cloudinaryPublicId = "";

    // If an image file was uploaded via multer, stream to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinaryService.uploadImageBuffer(
        req.file.buffer,
        `lost-and-found/${status || "items"}`
      );
      imageUrl = uploadResult.imageUrl;
      cloudinaryPublicId = uploadResult.publicId;
    } else if (req.body.imageUrl) {
      imageUrl = req.body.imageUrl;
    }

    // Create item in MongoDB
    const item = await Item.create({
      title,
      description,
      location,
      status: status || "lost",
      category: category || "Other",
      color: color || "",
      brand: brand || "",
      date: date ? new Date(date) : new Date(),
      reportedBy: req.user._id,
      imageUrl,
      cloudinaryPublicId,
    });

    // Invalidate search and item caches in Redis
    await cacheService.invalidateItemCaches();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/items
// @desc    Get items with keyword search, category & status filtering (cached in Redis)
// @access  Public
// -----------------------------------------------
const getAllItems = async (req, res) => {
  const { search, status, category } = req.query;
  const cacheKey = cacheService.getSearchCacheKey(search, { status, category });

  try {
    // Check Redis cache first
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json({ source: "cache", count: cached.length, items: cached });
    }

    // Build database query
    const filter = {};
    if (status && ["lost", "found"].includes(status)) {
      filter.status = status;
    }
    if (category && category !== "all") {
      filter.category = category;
    }

    if (search && search.trim()) {
      const regex = new RegExp(search.trim(), "i");
      filter.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex },
        { color: regex },
        { brand: regex },
      ];
    }

    const items = await Item.find(filter)
      .populate("reportedBy", "name email")
      .sort({ createdAt: -1 });

    // Cache results in Redis for 3 minutes (180s)
    await cacheService.set(cacheKey, items, 180);

    res.json({ source: "database", count: items.length, items });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   GET /api/items/:id
// @desc    Get a single item by ID (cached in Redis)
// @access  Public
// -----------------------------------------------
const getItemById = async (req, res) => {
  const cacheKey = `lostfound:item:${req.params.id}`;

  try {
    const cached = await cacheService.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const item = await Item.findById(req.params.id).populate(
      "reportedBy",
      "name email"
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Cache item for 5 minutes (300s)
    await cacheService.set(cacheKey, item, 300);

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   PUT /api/items/:id
// @desc    Update an item (owner or admin only)
// @access  Protected
// -----------------------------------------------
const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // Check ownership or admin status
    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to update this item." });
    }

    const {
      title,
      description,
      location,
      status,
      category,
      color,
      brand,
      date,
    } = req.body;

    if (title) item.title = title;
    if (description) item.description = description;
    if (location) item.location = location;
    if (status) item.status = status;
    if (category) item.category = category;
    if (color !== undefined) item.color = color;
    if (brand !== undefined) item.brand = brand;
    if (date) item.date = new Date(date);

    // If new image uploaded
    if (req.file) {
      // Delete old image if existed
      if (item.cloudinaryPublicId) {
        await cloudinaryService.deleteImage(item.cloudinaryPublicId);
      }
      const uploadResult = await cloudinaryService.uploadImageBuffer(
        req.file.buffer,
        `lost-and-found/${item.status || "items"}`
      );
      item.imageUrl = uploadResult.imageUrl;
      item.cloudinaryPublicId = uploadResult.publicId;
    }

    await item.save();
    await cacheService.invalidateItemCaches(item._id);

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// -----------------------------------------------
// @route   DELETE /api/items/:id
// @desc    Delete an item (owner or admin only)
// @access  Protected
// -----------------------------------------------
const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    const isOwner = item.reportedBy.toString() === req.user._id.toString();
    if (!isOwner && !req.user.isAdmin) {
      return res.status(403).json({ message: "Not authorized to delete this item." });
    }

    // Clean up Cloudinary asset
    if (item.cloudinaryPublicId) {
      await cloudinaryService.deleteImage(item.cloudinaryPublicId);
    }

    // Delete item and related claims and notifications
    await Promise.all([
      item.deleteOne(),
      Claim.deleteMany({ item: item._id }),
      Notification.deleteMany({ item: item._id }),
    ]);

    await cacheService.invalidateItemCaches(item._id);

    res.json({ message: "Item and associated records deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
};
