// middleware/auth.js - Kiểm tra token JWT trước khi cho phép truy cập API
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'gym_tracker_secret_2026'; // Trong thực tế nên lưu vào .env

function requireAuth(req, res, next) {
  // Lấy token từ header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: 'Bạn chưa đăng nhập!' });
  }

  try {
    // Xác minh token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Lưu thông tin user vào request
    next();             // Cho phép tiếp tục
  } catch (err) {
    return res.status(403).json({ error: 'Token không hợp lệ hoặc đã hết hạn!' });
  }
}

module.exports = { requireAuth, SECRET_KEY };