const db = require("../Config/mysql");

async function findAll() {
  return await db.all("SELECT * FROM grn_ledger");
}

async function findById(id) {
  return await db.get("SELECT * FROM grn_ledger WHERE id = ? LIMIT 1", [id]);
}

async function create(data) {
  const stmt = `INSERT INTO grn_ledger (grn_number, vendor_name, date_received, total_value, received_by, notes) VALUES (?, ?, ?, ?, ?, ?)`;
  const info = await db.run(stmt, [
    data.grn_number,
    data.vendor_name,
    data.date_received || new Date().toISOString().slice(0, 19).replace('T', ' '),
    data.total_value || 0,
    data.received_by || null,
    data.notes || null,
  ]);
  const id = info.lastInsertRowid || info.lastInsertROWID || info.lastInsertId || null;
  return await db.get("SELECT * FROM grn_ledger WHERE id = ? LIMIT 1", [id]);
}

module.exports = {
  findAll,
  findById,
  create,
};
