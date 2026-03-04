// calendar.js - Lịch tháng (đã xóa chuỗi streak, chỉ giữ số buổi)

let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth();
let selectedDate = new Date().toISOString().split('T')[0];
let workoutDates = {};   // { 'YYYY-MM-DD': true }

// =============================================
// KHỞI TẠO
// =============================================
async function initCalendar() {
  await loadMonthWorkouts();
  renderCalendar();
  selectDate(selectedDate);
}

// =============================================
// TẢI DỮ LIỆU THÁNG
// =============================================
async function loadMonthWorkouts() {
  try {
    const year  = currentYear;
    const month = currentMonth + 1;
    const data  = await apiGetWorkoutsByMonth(year, month);
    workoutDates = {};
    (data || []).forEach(w => { workoutDates[w.date] = true; });
  } catch (e) {
    console.error('Lỗi tải lịch tháng:', e);
  }
}

// =============================================
// RENDER LỊCH
// =============================================
function renderCalendar() {
  updateMonthTitle();
  renderDayHeaders();
  renderDays();
  updateMonthStats();
}

function updateMonthTitle() {
  const el = document.getElementById('calendar-month-title');
  if (el) el.textContent =
    `Tháng ${currentMonth + 1} / ${currentYear}`;
}

function renderDayHeaders() {
  const headers = document.getElementById('calendar-day-headers');
  if (!headers) return;
  const days = ['CN','T2','T3','T4','T5','T6','T7'];
  headers.innerHTML = days.map(d =>
    `<div class="cal-day-header">${d}</div>`
  ).join('');
}

function renderDays() {
  const grid = document.getElementById('calendar-grid');
  if (!grid) return;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date().toISOString().split('T')[0];

  let html = '';

  // Ô trống đầu tháng
  for (let i = 0; i < firstDay; i++) {
    html += `<div class="cal-day empty"></div>`;
  }

  // Các ngày
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday    = dateStr === today;
    const isSelected = dateStr === selectedDate;
    const hasWorkout = workoutDates[dateStr];

    html += `
      <div class="cal-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasWorkout ? 'has-workout' : ''}"
           onclick="selectDate('${dateStr}')">
        <span class="cal-day-num">${d}</span>
        ${hasWorkout ? '<span class="cal-fire">🔥</span>' : ''}
      </div>
    `;
  }

  grid.innerHTML = html;
}

// =============================================
// THỐNG KÊ THÁNG (chỉ số buổi, không có chuỗi)
// =============================================
function updateMonthStats() {
  const count = Object.keys(workoutDates).length;
  const el = document.getElementById('month-workout-count');
  if (el) el.textContent = `${count} buổi tập trong tháng`;
}

// =============================================
// CHỌN NGÀY
// =============================================
async function selectDate(dateStr) {
  selectedDate = dateStr;
  renderDays(); // cập nhật highlight
  if (typeof loadWorkoutForDate === 'function') {
    await loadWorkoutForDate(dateStr);
  }
}

// =============================================
// CHUYỂN THÁNG
// =============================================
async function prevMonth() {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  await loadMonthWorkouts();
  renderCalendar();
}

async function nextMonth() {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  await loadMonthWorkouts();
  renderCalendar();
}

// =============================================
// CẬP NHẬT KHI LƯU BUỔI TẬP
// =============================================
async function refreshCalendarAfterSave(dateStr) {
  await loadMonthWorkouts();
  renderCalendar();
  selectDate(selectedDate);
}