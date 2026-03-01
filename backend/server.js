// server.js - File chính khởi động server
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =============================================
// MIDDLEWARE
// =============================================
app.use(cors());
app.use(express.json());

// Serve file tĩnh từ thư mục frontend (nằm trong backend)
const frontendPath = path.join(__dirname, 'frontend');
console.log('Frontend path:', frontendPath);
app.use(express.static(frontendPath));

// =============================================
// ROUTES
// =============================================
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/workouts',  require('./routes/workouts'));
app.use('/api/exercises', require('./routes/exercises'));

// Mọi route không khớp → trả về index.html (phải đặt CUỐI CÙNG)
app.get('*', (req, res) => {
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