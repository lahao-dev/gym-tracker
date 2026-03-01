// timer.js - Đồng hồ đếm ngược

let timerTotal    = 30;   // Tổng thời gian (giây)
let timerLeft     = 30;   // Thời gian còn lại
let timerInterval = null; // Interval đang chạy
let timerRunning  = false;

const timerDisplay  = document.getElementById('timer-display');
const timerFill     = document.getElementById('timer-progress-fill');
const timerStartBtn = document.getElementById('timer-start-btn');

// Đặt thời gian từ nút preset
function setTimer(seconds) {
  resetTimer();
  timerTotal = seconds;
  timerLeft  = seconds;
  updateTimerDisplay();
  updateProgressBar();

  // Highlight nút được chọn
  document.querySelectorAll('.preset-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

// Bắt đầu / Tạm dừng
function toggleTimer() {
  if (timerRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (timerLeft <= 0) resetTimer();
  timerRunning = true;
  timerStartBtn.textContent = '⏸ Tạm dừng';
  timerDisplay.classList.add('running');

  timerInterval = setInterval(() => {
    timerLeft--;
    updateTimerDisplay();
    updateProgressBar();

    if (timerLeft <= 0) {
      finishTimer();
    }
  }, 1000);
}

function pauseTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerStartBtn.textContent = '▶ Tiếp tục';
  timerDisplay.classList.remove('running');
}

function resetTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerLeft = timerTotal;
  timerStartBtn.textContent = '▶ Bắt đầu';
  timerDisplay.classList.remove('running', 'finished');
  updateTimerDisplay();
  updateProgressBar();
}

function finishTimer() {
  timerRunning = false;
  clearInterval(timerInterval);
  timerLeft = 0;
  timerDisplay.classList.remove('running');
  timerDisplay.classList.add('finished');
  timerDisplay.textContent = '✅ Xong!';
  timerStartBtn.textContent = '▶ Bắt đầu';

  // Thông báo âm thanh (beep)
  playBeep();
}

function updateTimerDisplay() {
  const m = Math.floor(timerLeft / 60).toString().padStart(2, '0');
  const s = (timerLeft % 60).toString().padStart(2, '0');
  timerDisplay.textContent = `${m}:${s}`;
}

function updateProgressBar() {
  const pct = timerTotal > 0 ? (timerLeft / timerTotal) * 100 : 0;
  timerFill.style.width = pct + '%';
}

// Tạo âm thanh beep bằng Web Audio API
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.3 + 0.25);
      osc.start(ctx.currentTime + i * 0.3);
      osc.stop(ctx.currentTime + i * 0.3 + 0.25);
    }
  } catch (e) { /* Trình duyệt không hỗ trợ */ }
}

// Khởi tạo
updateTimerDisplay();