const AssetCategory = require("../Models/AssetCategory");
const GRNLedger = require("../Models/GRNLedger");
const Asset = require("../Models/Asset");

exports.getCategories = async (req, res) => {
  try {
    const categories = await AssetCategory.findAll();
    res.json({ success: true, categories });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const category = await AssetCategory.create(req.body);
    res.status(201).json({ success: true, category });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getGRNs = async (req, res) => {
  try {
    const grns = await GRNLedger.findAll();
    res.json({ success: true, grns });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createGRN = async (req, res) => {
  try {
    req.body.received_by = req.user.id;
    const grn = await GRNLedger.create(req.body);
    res.status(201).json({ success: true, grn });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll();
    res.json({ success: true, assets });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const { category_id } = req.body;
    if (!category_id) return res.status(400).json({ success: false, message: "Category ID is required" });

    const category = await AssetCategory.findById(category_id);
    if (!category) return res.status(404).json({ success: false, message: "Category not found" });

    const count = await Asset.countByCategory(category_id);
    const codeNumber = (count + 1).toString().padStart(3, '0');
    // Generates codes like IT-LAP-001
    req.body.code = `IT-${category.prefix_code}-${codeNumber}`;

    const asset = await Asset.create(req.body);
    res.status(201).json({ success: true, asset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateAssetStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, current_owner } = req.body;
    const asset = await Asset.updateStatus(id, status, current_owner || null);
    res.json({ success: true, asset });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
