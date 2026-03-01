// calendar.js - Lịch tháng + streak 🔥

let currentYear  = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0-11
let selectedDate = toDateStr(new Date());
let workoutDates = new Set(); // Tập hợp các ngày có buổi tập

const MONTHS_VI = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6',
                   'Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];

// Chuyển đổi Date → 'YYYY-MM-DD'
function toDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Tải danh sách ngày có tập từ API
async function loadWorkoutDates() {
  try {
    const workouts = await api.getWorkouts();
    workoutDates = new Set(workouts.map(w => w.date));
    renderCalendar();
    updateMonthStats();
  } catch (e) {
    console.error('Lỗi tải dữ liệu lịch:', e);
  }
}

// Chuyển tháng
function changeMonth(delta) {
  currentMonth += delta;
  if (currentMonth < 0)  { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0;  currentYear++; }
  renderCalendar();
  updateMonthStats();
}

// Vẽ lịch
function renderCalendar() {
  const grid  = document.getElementById('calendar-grid');
  const title = document.getElementById('calendar-title');
  grid.innerHTML = '';
  title.textContent = `${MONTHS_VI[currentMonth]} ${currentYear}`;

  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=CN
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrev  = new Date(currentYear, currentMonth, 0).getDate();
  const today = toDateStr(new Date());

  // Ô trống đầu tháng (tháng trước)
  for (let i = 0; i < firstDay; i++) {
    const day = daysInPrev - firstDay + 1 + i;
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = day;
    grid.appendChild(el);
  }

  // Các ngày trong tháng
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const el = document.createElement('div');
    el.className = 'cal-day';
    el.textContent = d;

    if (dateStr === today)        el.classList.add('today');
    if (dateStr === selectedDate) el.classList.add('selected');

    if (workoutDates.has(dateStr)) {
      el.classList.add('has-workout');
      // Chấm màu báo có tập
      const dot = document.createElement('div');
      dot.className = 'dot';
      el.appendChild(dot);

      // 🔥 Icon streak nếu là chuỗi liên tiếp
      if (isInStreak(dateStr)) {
        const fire = document.createElement('span');
        fire.className = 'streak-icon';
        fire.textContent = '🔥';
        el.appendChild(fire);
      }
    }

    el.onclick = () => selectDate(dateStr);
    grid.appendChild(el);
  }

  // Ô trống cuối tháng
  const totalCells = firstDay + daysInMonth;
  const remaining  = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
  for (let i = 1; i <= remaining; i++) {
    const el = document.createElement('div');
    el.className = 'cal-day other-month';
    el.textContent = i;
    grid.appendChild(el);
  }
}

// Kiểm tra ngày có nằm trong chuỗi streak không
function isInStreak(dateStr) {
  const d = new Date(dateStr);
  const prev = new Date(d);
  prev.setDate(prev.getDate() - 1);
  return workoutDates.has(toDateStr(prev));
}

// Tính chuỗi streak hiện tại
function getCurrentStreak() {
  let streak = 0;
  const today = new Date();
  const check = new Date(today);

  while (true) {
    const ds = toDateStr(check);
    if (workoutDates.has(ds)) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

// Cập nhật thống kê tháng
function updateMonthStats() {
  const prefix = `${currentYear}-${String(currentMonth + 1).padStart(2,'0')}`;
  const sessions = [...workoutDates].filter(d => d.startsWith(prefix)).length;
  document.getElementById('stat-sessions').textContent = sessions;
  document.getElementById('stat-streak').textContent   = getCurrentStreak();
}

// Chọn ngày
function selectDate(dateStr) {
  selectedDate = dateStr;
  renderCalendar();       // Re-render để highlight ngày mới
  loadWorkoutForDate(dateStr); // Tải thông tin buổi tập (trong workout.js)
}