// src/controllers/notificationController.js
// Handles user notifications and alerts.

const Notification = require("../models/Notification");

// -----------------------------------------------
// @route   GET /api/notifications
// @desc    Get all notifications for logged-in user
// @access  Protected
// -----------------------------------------------
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("item", "title location status imageUrl")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });

    res.json({
      success: true,
      unreadCount,
      notifications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------
// @route   PUT /api/notifications/:id/read
// @desc    Mark a single notification as read
// @access  Protected
// -----------------------------------------------
const markNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      recipient: req.user._id,
    });

    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found." });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// -----------------------------------------------
// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications for logged-in user as read
// @access  Protected
// -----------------------------------------------
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ success: true, message: "All notifications marked as read." });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUserNotifications,
  markNotificationRead,
  markAllRead,
};
