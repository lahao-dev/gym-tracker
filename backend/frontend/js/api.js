// api.js - Tất cả các hàm gọi API đến backend

const API_BASE = window.location.origin + '/api';

// Lấy token từ localStorage
function getToken() {
  return localStorage.getItem('gym_token');
}

// Hàm fetch chung có đính kèm token
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

// ---- AUTH ----
const api = {
  register: (body) => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:    (body) => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),

  // ---- WORKOUTS ----
  getWorkouts:     ()           => apiFetch('/workouts'),
  getWorkout:      (date)       => apiFetch(`/workouts/${date}`),
  saveWorkout:     (body)       => apiFetch('/workouts', { method: 'POST', body: JSON.stringify(body) }),
  deleteWorkout:   (id)         => apiFetch(`/workouts/${id}`, { method: 'DELETE' }),
  getProgress:     (name)       => apiFetch(`/workouts/progress/${encodeURIComponent(name)}`),

  // ---- EXERCISES ----
  addExercise:     (body)       => apiFetch('/exercises', { method: 'POST', body: JSON.stringify(body) }),
  updateExercise:  (id, body)   => apiFetch(`/exercises/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteExercise:  (id)         => apiFetch(`/exercises/${id}`, { method: 'DELETE' }),
  copyWorkout:     (body)       => apiFetch('/exercises/copy', { method: 'POST', body: JSON.stringify(body) })
};