// api.js - Tất cả các hàm gọi API đến backend

const API_BASE = window.location.origin + '/api';

// =============================================
// HÀM FETCH CHUNG
// =============================================
function getToken() {
  return localStorage.getItem('gym_token');
}

async function apiFetch(url, options = {}) {
  const token = getToken();
  const res = await fetch(API_BASE + url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Lỗi không xác định');
  return data;
}

// =============================================
// AUTH
// =============================================
function apiRegister(body) {
  return apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) });
}

function apiLogin(body) {
  return apiFetch('/auth/login', { method: 'POST', body: JSON.stringify(body) });
}

// =============================================
// WORKOUTS
// =============================================

// Lấy tất cả buổi tập (dùng cho lịch tháng)
function apiGetWorkoutsByMonth(year, month) {
  return apiFetch(`/workouts?year=${year}&month=${month}`);
}

// Lấy buổi tập theo ngày cụ thể
function apiGetWorkoutByDate(date) {
  return apiFetch(`/workouts/${date}`);
}

// Tạo buổi tập mới
function apiCreateWorkout(body) {
  return apiFetch('/workouts', { method: 'POST', body: JSON.stringify(body) });
}

// Cập nhật buổi tập (ghi chú, đánh giá sao)
function apiUpdateWorkout(id, body) {
  return apiFetch(`/workouts/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

// Xóa buổi tập
function apiDeleteWorkout(id) {
  return apiFetch(`/workouts/${id}`, { method: 'DELETE' });
}

// Lấy lịch sử tiến trình tạ theo tên bài tập
function apiGetProgress(exerciseName) {
  return apiFetch(`/workouts/progress/${encodeURIComponent(exerciseName)}`);
}

// =============================================
// EXERCISES
// =============================================

// Thêm bài tập vào buổi tập
function apiCreateExercise(body) {
  return apiFetch('/exercises', { method: 'POST', body: JSON.stringify(body) });
}

// Cập nhật bài tập (sửa, tick set...)
function apiUpdateExercise(id, body) {
  return apiFetch(`/exercises/${id}`, { method: 'PUT', body: JSON.stringify(body) });
}

// Xóa bài tập
function apiDeleteExercise(id) {
  return apiFetch(`/exercises/${id}`, { method: 'DELETE' });
}

// =============================================
// CHAT AI
// =============================================
function apiChat(messages) {
  return apiFetch('/chat', { method: 'POST', body: JSON.stringify({ messages }) });
}