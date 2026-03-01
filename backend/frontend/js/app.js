// app.js - File khởi động chính, quản lý auth và điều phối

// =============================================
// KIỂM TRA ĐĂNG NHẬP KHI TẢI TRANG
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('gym_token');
  const user  = JSON.parse(localStorage.getItem('gym_user') || 'null');

  if (token && user) {
    showMainPage(user);
  } else {
    showAuthPage();
  }
});

// =============================================
// AUTH: ĐĂNG NHẬP
// =============================================
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');
  errEl.textContent = '';

  try {
    const res = await api.login({ username, password });
    localStorage.setItem('gym_token', res.token);
    localStorage.setItem('gym_user', JSON.stringify(res.user));
    showMainPage(res.user);
  } catch (e) {
    errEl.textContent = e.message;
  }
});

// =============================================
// AUTH: ĐĂNG KÝ
// =============================================
document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const full_name        = document.getElementById('reg-fullname').value.trim();
  const username         = document.getElementById('reg-username').value.trim();
  const password         = document.getElementById('reg-password').value;
  const confirm_password = document.getElementById('reg-confirm').value;
  const errEl = document.getElementById('register-error');
  errEl.textContent = '';

  try {
    const res = await api.register({ full_name, username, password, confirm_password });
    localStorage.setItem('gym_token', res.token);
    localStorage.setItem('gym_user', JSON.stringify(res.user));
    showMainPage(res.user);
  } catch (e) {
    errEl.textContent = e.message;
  }
});

// =============================================
// CHUYỂN TAB ĐĂNG NHẬP / ĐĂNG KÝ
// =============================================
function switchTab(tab) {
  const loginForm  = document.getElementById('login-form');
  const regForm    = document.getElementById('register-form');
  const tabs       = document.querySelectorAll('.tab-btn');

  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    regForm.classList.add('hidden');
    tabs[0].classList.add('active');
    tabs[1].classList.remove('active');
  } else {
    loginForm.classList.add('hidden');
    regForm.classList.remove('hidden');
    tabs[0].classList.remove('active');
    tabs[1].classList.add('active');
  }
}

// =============================================
// ĐĂNG XUẤT
// =============================================
function logout() {
  localStorage.removeItem('gym_token');
  localStorage.removeItem('gym_user');
  showAuthPage();
}

// =============================================
// HIỂN THỊ TRANG
// =============================================
function showAuthPage() {
  document.getElementById('auth-page').classList.remove('hidden');
  document.getElementById('main-page').classList.add('hidden');
}

function showMainPage(user) {
  document.getElementById('auth-page').classList.add('hidden');
  document.getElementById('main-page').classList.remove('hidden');
  document.getElementById('user-greeting').textContent = `Xin chào, ${user.full_name} 👋`;

  // Khởi tạo lịch và tải dữ liệu
  renderCalendar();
  loadWorkoutDates();

  // Tải buổi tập ngày hôm nay
  loadWorkoutForDate(selectedDate);
}