// server.js - File chính khởi động server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors());                        // Cho phép frontend gọi API
app.use(express.json());                // Parse JSON từ request body

// Serve file tĩnh từ thư mục frontend
app.use(express.static(path.join(__dirname, '../frontend')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =============================================
// ROUTES
// =============================================
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/workouts',  require('./routes/workouts'));
app.use('/api/exercises', require('./routes/exercises'));

// Mọi route không khớp → trả về index.html (Single Page App)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// =============================================
// KHỞI ĐỘNG SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📁 Frontend:  http://localhost:${PORT}`);
  console.log(`🔌 API:       http://localhost:${PORT}/api`);
});