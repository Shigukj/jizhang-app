const initSqlJs = require('sql.js');
const path = require('path');
const fs = require('fs');

let db = null;

// 初始化数据库
async function initDatabase() {
  const SQL = await initSqlJs();
  
  // 数据库文件路径
  const dbPath = path.join(__dirname, '../../data/jizhang.db');
  const dbDir = path.dirname(dbPath);
  
  // 确保数据目录存在
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // 如果数据库文件存在，加载它；否则创建新的
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  // 创建表
  createTables();
  
  // 初始化系统分类
  initCategories();
  
  // 初始化管理员账号
  await initAdminUser();
  
  console.log('✅ 数据库初始化完成');
  
  return db;
}

// 创建数据表
function createTables() {
  // 用户表
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      phone TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      avatar TEXT,
      status INTEGER DEFAULT 1,
      is_admin INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 分类表
  db.run(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      icon TEXT NOT NULL,
      color TEXT DEFAULT '#00A5A0',
      parent_id INTEGER,
      sort_order INTEGER DEFAULT 0,
      is_system INTEGER DEFAULT 1,
      user_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 账本表
  db.run(`
    CREATE TABLE IF NOT EXISTS ledgers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      icon TEXT DEFAULT '📒',
      color TEXT DEFAULT '#00A5A0',
      balance REAL DEFAULT 0,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 账目表
  db.run(`
    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      ledger_id INTEGER,
      category_id INTEGER NOT NULL,
      type TEXT NOT NULL,
      amount REAL NOT NULL,
      note TEXT,
      record_date TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 预算表
  db.run(`
    CREATE TABLE IF NOT EXISTS budgets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      category_id INTEGER,
      amount REAL NOT NULL,
      period TEXT DEFAULT 'month',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  saveDatabase();
}

// 初始化系统分类
function initCategories() {
  const result = db.exec("SELECT COUNT(*) as count FROM categories WHERE is_system = 1");
  const count = result[0]?.values[0]?.[0] || 0;
  
  if (count > 0) return;

  const expenseCategories = [
    { name: '餐饮', icon: '🍔', color: '#FF6B6B' },
    { name: '交通', icon: '🚗', color: '#4ECDC4' },
    { name: '购物', icon: '🛒', color: '#FFE66D' },
    { name: '住房', icon: '🏠', color: '#95E1D3' },
    { name: '娱乐', icon: '🎮', color: '#DDA0DD' },
    { name: '通讯', icon: '📱', color: '#87CEEB' },
    { name: '医疗', icon: '🏥', color: '#FF9999' },
    { name: '教育', icon: '📚', color: '#98D8C8' },
    { name: '服饰', icon: '👔', color: '#F0E68C' },
    { name: '人情', icon: '🎁', color: '#FFB6C1' },
    { name: '宠物', icon: '🐾', color: '#DEB887' },
    { name: '其他', icon: '📦', color: '#C0C0C0' }
  ];

  const incomeCategories = [
    { name: '工资', icon: '💰', color: '#52C41A' },
    { name: '兼职', icon: '💼', color: '#73D13D' },
    { name: '投资', icon: '📈', color: '#95DE64' },
    { name: '理财', icon: '🏦', color: '#B7EB8F' },
    { name: '礼金', icon: '🧧', color: '#FF7875' },
    { name: '退款', icon: '↩️', color: '#FFA940' },
    { name: '其他', icon: '💵', color: '#FFC53D' }
  ];

  expenseCategories.forEach((cat, index) => {
    db.run(
      "INSERT INTO categories (name, type, icon, color, sort_order, is_system) VALUES (?, ?, ?, ?, ?, 1)",
      [cat.name, 'expense', cat.icon, cat.color, index + 1]
    );
  });
  
  incomeCategories.forEach((cat, index) => {
    db.run(
      "INSERT INTO categories (name, type, icon, color, sort_order, is_system) VALUES (?, ?, ?, ?, ?, 1)",
      [cat.name, 'income', cat.icon, cat.color, index + 1]
    );
  });
  
  saveDatabase();
  console.log('✅ 系统分类初始化完成');
}

// 初始化管理员账号
async function initAdminUser() {
  const result = db.exec("SELECT COUNT(*) as count FROM users WHERE username = 'admin'");
  const count = result[0]?.values[0]?.[0] || 0;
  
  if (count > 0) return;

  const bcrypt = require('bcryptjs');
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  db.run(`
    INSERT INTO users (username, phone, password_hash, is_admin, status)
    VALUES ('admin', '13800000000', ?, 1, 1)
  `, [passwordHash]);
  
  saveDatabase();
  console.log('✅ 管理员账号初始化完成 (admin / admin123)');
}

// 保存数据库到文件
function saveDatabase() {
  if (!db) return;
  const dbPath = path.join(__dirname, '../../data/jizhang.db');
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// 获取数据库实例
function getDb() {
  return db;
}

// 查询辅助函数
function prepare(sql) {
  return {
    run: (...params) => {
      db.run(sql, params);
      saveDatabase();
      return { lastInsertRowid: getLastInsertRowId() };
    },
    get: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
      }
      stmt.free();
      return undefined;
    },
    all: (...params) => {
      const stmt = db.prepare(sql);
      stmt.bind(params);
      const results = [];
      while (stmt.step()) {
        results.push(stmt.getAsObject());
      }
      stmt.free();
      return results;
    }
  };
}

// 获取最后插入的 ID
function getLastInsertRowId() {
  const result = db.exec("SELECT last_insert_rowid() as id");
  return result[0]?.values[0]?.[0] || 0;
}

module.exports = { 
  initDatabase, 
  getDb, 
  prepare, 
  saveDatabase,
  initAdminUser
};
