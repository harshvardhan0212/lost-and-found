// src/middlewares/adminMiddleware.js
// This middleware runs AFTER authMiddleware.
// It checks if the logged-in user has admin rights (isAdmin: true).
// Usage: router.put("/...", protect, isAdmin, controller)

const isAdmin = (req, res, next) => {
  // req.user is set by authMiddleware after JWT verification
  if (req.user && req.user.isAdmin) {
    next(); // User is admin — allow access
  } else {
    res.status(403).json({ message: "Access denied. Admins only." });
  }
};

module.exports = { isAdmin };
