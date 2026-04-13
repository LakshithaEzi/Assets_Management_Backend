const db = require("../Config/mysql");

async function findAll() {
  return await db.all("SELECT * FROM asset_categories");
}

async function findById(id) {
  return await db.get("SELECT * FROM asset_categories WHERE id = ? LIMIT 1", [id]);
}

async function create(data) {
  const stmt = `INSERT INTO asset_categories (name, prefix_code, description) VALUES (?, ?, ?)`;
  const info = await db.run(stmt, [data.name, data.prefix_code, data.description || null]);
  const id = info.lastInsertRowid || info.lastInsertROWID || info.lastInsertId || null;
  return await db.get("SELECT * FROM asset_categories WHERE id = ? LIMIT 1", [id]);
}

module.exports = {
  findAll,
  findById,
  create,
};
