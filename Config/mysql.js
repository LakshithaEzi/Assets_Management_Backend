const mysql = require("mysql2/promise");

// Create connection pool
let pool;

async function createPool() {
  if (pool) return pool;

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "1111",
    database: process.env.DB_NAME || "farm_app",
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  console.log("✅ MySQL connection pool created");
  return pool;
}

// Initialize database tables
async function init() {
  const connection = await pool.getConnection();

  try {
    // Create Users Table
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(255) UNIQUE,
        email VARCHAR(255) UNIQUE,
        password VARCHAR(255),
        role VARCHAR(50),
        profile TEXT,
        isActive TINYINT(1) DEFAULT 1,
        isEmailVerified TINYINT(1) DEFAULT 0,
        lastLogin DATETIME,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createUsersTable);
    console.log("✅ MySQL: users table is ready");

    // Create Refresh Tokens Table
    const createRefreshTable = `
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        id INT PRIMARY KEY AUTO_INCREMENT,
        token VARCHAR(255) UNIQUE,
        user_id INT,
        expiresAt DATETIME,
        createdAt DATETIME,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `;
    await connection.query(createRefreshTable);
    console.log("✅ MySQL: refresh_tokens table is ready");



    // Create IT Asset Categories Table
    const createAssetCategoriesTable = `
      CREATE TABLE IF NOT EXISTS asset_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(100) UNIQUE,
        prefix_code VARCHAR(10) UNIQUE,
        description TEXT,
        isActive TINYINT(1) DEFAULT 1,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    await connection.query(createAssetCategoriesTable);
    console.log("✅ MySQL: asset_categories table is ready");

    // Create GRN Ledger Table
    const createGRNLedgerTable = `
      CREATE TABLE IF NOT EXISTS grn_ledger (
        id INT PRIMARY KEY AUTO_INCREMENT,
        grn_number VARCHAR(100) UNIQUE,
        vendor_name VARCHAR(255),
        date_received DATETIME,
        total_value DECIMAL(10, 2),
        received_by INT,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
      )
    `;
    await connection.query(createGRNLedgerTable);
    console.log("✅ MySQL: grn_ledger table is ready");

    // Create Assets Table
    const createAssetsTable = `
      CREATE TABLE IF NOT EXISTS assets (
        id INT PRIMARY KEY AUTO_INCREMENT,
        code VARCHAR(100) UNIQUE,
        name VARCHAR(255),
        category_id INT,
        serial_number VARCHAR(100),
        status VARCHAR(50) DEFAULT 'in_stock',
        purchased_date DATETIME,
        price DECIMAL(10, 2),
        grn_id INT,
        current_owner INT,
        location VARCHAR(100),
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES asset_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (grn_id) REFERENCES grn_ledger(id) ON DELETE SET NULL,
        FOREIGN KEY (current_owner) REFERENCES users(id) ON DELETE SET NULL
      )
    `;
    await connection.query(createAssetsTable);
    console.log("✅ MySQL: assets table is ready");
  } finally {
    connection.release();
  }
}

// Helper functions for database operations (async versions)
async function run(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.execute(query, params);
    return {
      changes: result.affectedRows || 0,
      lastInsertRowid: result.insertId || 0,
    };
  } finally {
    connection.release();
  }
}

async function get(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows[0] || null;
  } finally {
    connection.release();
  }
}

async function all(query, params = []) {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.execute(query, params);
    return rows;
  } finally {
    connection.release();
  }
}

// Close pool (for graceful shutdown)
async function close() {
  if (pool) {
    await pool.end();
    console.log("✅ MySQL connection pool closed");
  }
}

module.exports = {
  createPool,
  init,
  run,
  get,
  all,
  close,
};
