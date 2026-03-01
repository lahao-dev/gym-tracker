// routes/auth.js - API đăng ký và đăng nhập
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const { SECRET_KEY } = require('../middleware/auth');

// POST /api/auth/register - Đăng ký tài khoản
router.post('/register', async (req, res) => {
  const { full_name, username, password, confirm_password } = req.body;

  if (!full_name || !username || !password || !confirm_password)
    return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin!' });
  if (password !== confirm_password)
    return res.status(400).json({ error: 'Mật khẩu nhập lại không khớp!' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Mật khẩu phải có ít nhất 6 ký tự!' });
  if (username.length < 3)
    return res.status(400).json({ error: 'Tên đăng nhập phải có ít nhất 3 ký tự!' });

  try {
    const existing = await db.asyncGet('SELECT id FROM users WHERE username = ?', [username]);
    if (existing) return res.status(409).json({ error: 'Tên đăng nhập đã được sử dụng!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.asyncRun(
      'INSERT INTO users (full_name, username, password) VALUES (?, ?, ?)',
      [full_name, username, hashedPassword]
    );

    const token = jwt.sign(
      { id: result.lastID, username, full_name },
      SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      message: 'Đăng ký thành công!',
      token,
      user: { id: result.lastID, username, full_name }
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

// POST /api/auth/login - Đăng nhập
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Vui lòng nhập tên đăng nhập và mật khẩu!' });

  try {
    const user = await db.asyncGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng!' });

    const token = jwt.sign(
      { id: user.id, username: user.username, full_name: user.full_name },
      SECRET_KEY,
      { expiresIn: '30d' }
    );

    res.json({
      message: 'Đăng nhập thành công!',
      token,
      user: { id: user.id, username: user.username, full_name: user.full_name }
    });
  } catch (err) {
    res.status(500).json({ error: 'Lỗi server: ' + err.message });
  }
});

module.exports = router;