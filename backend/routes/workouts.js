// routes/workouts.js - API quản lý buổi tập
const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// GET /api/workouts - Lấy tất cả buổi tập
router.get('/', async (req, res) => {
  try {
    const workouts = await db.asyncAll(
      'SELECT * FROM workouts WHERE user_id = ? ORDER BY date DESC',
      [req.user.id]
    );
    res.json(workouts);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/workouts/progress/:name - Biểu đồ tiến trình (đặt TRƯỚC /:date)
router.get('/progress/:name', async (req, res) => {
  try {
    const data = await db.asyncAll(`
      SELECT w.date, e.weight_kg, e.sets, e.reps
      FROM exercises e
      JOIN workouts w ON e.workout_id = w.id
      WHERE w.user_id = ? AND LOWER(e.name) = LOWER(?)
      ORDER BY w.date ASC
    `, [req.user.id, req.params.name]);
    res.json(data);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/workouts/:date - Lấy buổi tập theo ngày
router.get('/:date', async (req, res) => {
  try {
    const workout = await db.asyncGet(
      'SELECT * FROM workouts WHERE user_id = ? AND date = ?',
      [req.user.id, req.params.date]
    );
    if (!workout) return res.json(null);

    const exercises = await db.asyncAll(
      'SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index',
      [workout.id]
    );
    res.json({ ...workout, exercises });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/workouts - Tạo hoặc cập nhật buổi tập
router.post('/', async (req, res) => {
  const { date, notes, rating } = req.body;
  if (!date) return res.status(400).json({ error: 'Thiếu ngày tập!' });

  try {
    await db.asyncRun(`
      INSERT INTO workouts (user_id, date, notes, rating)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, date) DO UPDATE SET
        notes  = excluded.notes,
        rating = excluded.rating
    `, [req.user.id, date, notes || '', rating || 0]);

    const workout = await db.asyncGet(
      'SELECT * FROM workouts WHERE user_id = ? AND date = ?',
      [req.user.id, date]
    );
    res.json(workout);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/workouts/:id - Xóa buổi tập
router.delete('/:id', async (req, res) => {
  try {
    const workout = await db.asyncGet(
      'SELECT * FROM workouts WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!workout) return res.status(404).json({ error: 'Không tìm thấy buổi tập!' });

    await db.asyncRun('DELETE FROM workouts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Đã xóa buổi tập!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;