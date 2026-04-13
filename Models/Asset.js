const db = require("../Config/mysql");

async function findAll() {
  return await db.all("SELECT * FROM assets");
}

async function findById(id) {
  return await db.get("SELECT * FROM assets WHERE id = ? LIMIT 1", [id]);
}

async function create(data) {
  const stmt = `INSERT INTO assets (code, name, category_id, serial_number, status, purchased_date, price, grn_id, current_owner, location) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const info = await db.run(stmt, [
    data.code,
    data.name,
    data.category_id,
    data.serial_number || null,
    data.status || "in_stock",
    data.purchased_date || null,
    data.price || 0,
    data.grn_id || null,
    data.current_owner || null,
    data.location || null,
  ]);
  const id = info.lastInsertRowid || info.lastInsertROWID || info.lastInsertId || info.insertId || null;
  return await db.get("SELECT * FROM assets WHERE id = ? LIMIT 1", [id]);
}

async function updateStatus(id, newStatus, currentOwner = null) {
  const stmt = `UPDATE assets SET status = ?, current_owner = ? WHERE id = ?`;
  await db.run(stmt, [newStatus, currentOwner, id]);
  return await findById(id);
}

async function countByCategory(categoryId) {
  const row = await db.get("SELECT COUNT(*) as count FROM assets WHERE category_id = ?", [categoryId]);
  return row ? row.count : 0;
}

module.exports = {
  findAll,
  findById,
  create,
  updateStatus,
  countByCategory,
};
