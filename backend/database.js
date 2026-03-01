// database.js - Kết nối và khởi tạo SQLite
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'), (err) => {
  if (err) {
    console.error('❌ Lỗi kết nối database:', err.message);
  } else {
    console.log('✅ Database đã sẵn sàng!');
  }
});

// Bật foreign keys
db.run('PRAGMA foreign_keys = ON');

// Tạo bảng nếu chưa tồn tại
db.serialize(() => {
  // Bảng người dùng
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name  TEXT    NOT NULL,
    username   TEXT    NOT NULL UNIQUE,
    password   TEXT    NOT NULL,
    created_at TEXT    DEFAULT (datetime('now','localtime'))
  )`);

  // Bảng buổi tập
  db.run(`CREATE TABLE IF NOT EXISTS workouts (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER NOT NULL,
    date       TEXT    NOT NULL,
    notes      TEXT    DEFAULT '',
    rating     INTEGER DEFAULT 0,
    created_at TEXT    DEFAULT (datetime('now','localtime')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, date)
  )`);

  // Bảng bài tập
  db.run(`CREATE TABLE IF NOT EXISTS exercises (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    workout_id   INTEGER NOT NULL,
    name         TEXT    NOT NULL,
    sets         INTEGER DEFAULT 3,
    reps         INTEGER DEFAULT 10,
    weight_kg    REAL    DEFAULT 0,
    rest_seconds INTEGER DEFAULT 60,
    notes        TEXT    DEFAULT '',
    completed    INTEGER DEFAULT 0,
    order_index  INTEGER DEFAULT 0,
    FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
  )`);
});

// Helper: chạy query không trả dữ liệu (INSERT, UPDATE, DELETE)
db.asyncRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) {
    if (err) reject(err);
    else resolve({ lastID: this.lastID, changes: this.changes });
  });
});

// Helper: lấy 1 dòng
db.asyncGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => {
    if (err) reject(err);
    else resolve(row);
  });
});

// Helper: lấy nhiều dòng
db.asyncAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => {
    if (err) reject(err);
    else resolve(rows);
  });
});

module.exports = db;