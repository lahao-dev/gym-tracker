// routes/exercises.js - API quản lý bài tập
const express = require('express');
const router = express.Router();
const db = require('../database');
const { requireAuth } = require('../middleware/auth');

router.use(requireAuth);

// Helper: kiểm tra workout có thuộc về user không
async function getWorkoutForUser(workoutId, userId) {
  return db.asyncGet('SELECT * FROM workouts WHERE id = ? AND user_id = ?', [workoutId, userId]);
}

// POST /api/exercises - Thêm bài tập
router.post('/', async (req, res) => {
  const { workout_id, name, sets, reps, weight_kg, rest_seconds, notes } = req.body;
  if (!workout_id || !name) return res.status(400).json({ error: 'Thiếu thông tin bài tập!' });

  try {
    if (!await getWorkoutForUser(workout_id, req.user.id))
      return res.status(403).json({ error: 'Không có quyền truy cập!' });

    const countRow = await db.asyncGet('SELECT COUNT(*) as c FROM exercises WHERE workout_id = ?', [workout_id]);
    const result = await db.asyncRun(`
      INSERT INTO exercises (workout_id, name, sets, reps, weight_kg, rest_seconds, notes, order_index)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [workout_id, name, sets || 3, reps || 10, weight_kg || 0, rest_seconds || 60, notes || '', countRow.c]);

    const exercise = await db.asyncGet('SELECT * FROM exercises WHERE id = ?', [result.lastID]);
    res.status(201).json(exercise);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/exercises/:id - Sửa bài tập
router.put('/:id', async (req, res) => {
  const { name, sets, reps, weight_kg, rest_seconds, notes, completed } = req.body;

  try {
    const exercise = await db.asyncGet('SELECT * FROM exercises WHERE id = ?', [req.params.id]);
    if (!exercise) return res.status(404).json({ error: 'Không tìm thấy bài tập!' });
    if (!await getWorkoutForUser(exercise.workout_id, req.user.id))
      return res.status(403).json({ error: 'Không có quyền truy cập!' });

    await db.asyncRun(`
      UPDATE exercises SET
        name         = COALESCE(?, name),
        sets         = COALESCE(?, sets),
        reps         = COALESCE(?, reps),
        weight_kg    = COALESCE(?, weight_kg),
        rest_seconds = COALESCE(?, rest_seconds),
        notes        = COALESCE(?, notes),
        completed    = COALESCE(?, completed)
      WHERE id = ?
    `, [name, sets, reps, weight_kg, rest_seconds, notes, completed, req.params.id]);

    const updated = await db.asyncGet('SELECT * FROM exercises WHERE id = ?', [req.params.id]);
    res.json(updated);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/exercises/:id - Xóa bài tập
router.delete('/:id', async (req, res) => {
  try {
    const exercise = await db.asyncGet('SELECT * FROM exercises WHERE id = ?', [req.params.id]);
    if (!exercise) return res.status(404).json({ error: 'Không tìm thấy bài tập!' });
    if (!await getWorkoutForUser(exercise.workout_id, req.user.id))
      return res.status(403).json({ error: 'Không có quyền truy cập!' });

    await db.asyncRun('DELETE FROM exercises WHERE id = ?', [req.params.id]);
    res.json({ message: 'Đã xóa bài tập!' });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/exercises/copy - Sao chép lịch tập
router.post('/copy', async (req, res) => {
  const { from_date, to_date } = req.body;
  if (!from_date || !to_date) return res.status(400).json({ error: 'Thiếu ngày nguồn hoặc ngày đích!' });

  try {
    const fromWorkout = await db.asyncGet(
      'SELECT * FROM workouts WHERE user_id = ? AND date = ?',
      [req.user.id, from_date]
    );
    if (!fromWorkout) return res.status(404).json({ error: 'Không tìm thấy buổi tập ngày nguồn!' });

    // Tạo workout đích nếu chưa có
    await db.asyncRun(`
      INSERT INTO workouts (user_id, date, notes, rating)
      VALUES (?, ?, '', 0)
      ON CONFLICT(user_id, date) DO NOTHING
    `, [req.user.id, to_date]);

    const toWorkout = await db.asyncGet(
      'SELECT * FROM workouts WHERE user_id = ? AND date = ?',
      [req.user.id, to_date]
    );

    const exercises = await db.asyncAll(
      'SELECT * FROM exercises WHERE workout_id = ?',
      [fromWorkout.id]
    );

    // Sao chép từng bài tập
    for (const ex of exercises) {
      await db.asyncRun(`
        INSERT INTO exercises (workout_id, name, sets, reps, weight_kg, rest_seconds, notes, order_index, completed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)
      `, [toWorkout.id, ex.name, ex.sets, ex.reps, ex.weight_kg, ex.rest_seconds, ex.notes, ex.order_index]);
    }

    const newExercises = await db.asyncAll(
      'SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index',
      [toWorkout.id]
    );

    res.json({ ...toWorkout, exercises: newExercises });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;