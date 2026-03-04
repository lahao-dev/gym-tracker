// server.js - File chính khởi động server
const express = require('express');
const cors    = require('cors');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors());
app.use(express.json());

// =============================================
// ROUTES API (đặt TRƯỚC static files)
// =============================================
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/workouts',  require('./routes/workouts'));
app.use('/api/exercises', require('./routes/exercises'));
app.use('/api/chat',      require('./routes/chat'));

// =============================================
// SERVE FILE TĨNH (đặt SAU các API routes)
// =============================================
const frontendPath = path.join(__dirname, 'frontend');
app.use(express.static(frontendPath));

// Chỉ trả về index.html cho các route KHÔNG phải file tĩnh và KHÔNG phải /api
app.get('*', (req, res) => {
  // Nếu request là file có đuôi (.js, .css, .png...) → trả về 404 thật sự
  if (req.path.match(/\.[a-zA-Z0-9]+$/)) {
    return res.status(404).send('File not found');
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// =============================================
// KHỞI ĐỘNG SERVER
// =============================================
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
  console.log(`📁 Frontend path: ${frontendPath}`);
  console.log(`🔌 API: http://localhost:${PORT}/api`);
});