const express = require('express');
const router = express.Router();
const adminController = require('../Controllers/adminController');
const { protect, restrictTo } = require('../Middleware/authMiddleware');

// All admin routes are protected and restricted to admin role
router.use(protect);
// We can use the existing roles or an 'admin' role if available
router.use(restrictTo('admin', 'Super Admin'));

// User Management
router.get('/users', adminController.getAllUsers);

// Statistics
router.get('/statistics', adminController.getStatistics);

module.exports = router;