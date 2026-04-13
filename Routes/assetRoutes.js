const express = require("express");
const router = express.Router();
const assetController = require("../Controllers/assetController");
const { protect, restrictTo } = require("../Middleware/authMiddleware");

// All asset routes require authentication
router.use(protect);

// Only allow specific IT department roles access
const allowAllIT = restrictTo("Super Admin", "Admin", "Data Entry");
const allowAdmins = restrictTo("Super Admin", "Admin");

// Categories
router.get("/categories", allowAllIT, assetController.getCategories);
router.post("/categories", allowAdmins, assetController.createCategory);

// GRNs
router.get("/grns", allowAllIT, assetController.getGRNs);
router.post("/grns", allowAdmins, assetController.createGRN);

// Assets
router.get("/", allowAllIT, assetController.getAssets);
router.post("/", allowAllIT, assetController.createAsset);
router.put("/:id/status", allowAdmins, assetController.updateAssetStatus);

module.exports = router;
