// app.js - File khởi động chính, quản lý auth, tabs và chatbox AI

// =============================================
// KIỂM TRA ĐĂNG NHẬP KHI TẢI TRANG
// =============================================
window.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('gym_token');
  if (token) {
    showApp();
  } else {
    showAuth();
  }
});

// =============================================
// HIỂN THỊ AUTH / APP
// =============================================
function showAuth() {
  document.getElementById('auth-section').style.display = 'flex';
  document.getElementById('app-section').style.display  = 'none';
}

function showApp() {
  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('app-section').style.display  = 'block';

  const user  = JSON.parse(localStorage.getItem('gym_user') || '{}');
  const nameEl = document.getElementById('user-name');
  if (nameEl) nameEl.textContent = user.full_name || user.username || 'Bạn';

  // Mặc định mở tab lịch tập
  switchTab('workout');
}

// =============================================
// CHUYỂN TAB
// =============================================
function switchTab(tab) {
  // Ẩn tất cả tab content
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  // Bỏ active tất cả nav tab
  document.querySelectorAll('.nav-tab').forEach(el => el.classList.remove('active'));

  if (tab === 'workout') {
    document.getElementById('workout-tab').style.display = 'block';
    const btn = document.querySelector('[data-tab="workout"]');
    if (btn) btn.classList.add('active');
    initCalendar();

  } else if (tab === 'library') {
    const libTab = document.getElementById('library-tab');
    libTab.style.display = 'block';
    const btn = document.querySelector('[data-tab="library"]');
    if (btn) btn.classList.add('active');

    // Dùng requestAnimationFrame để đảm bảo DOM đã render xong
    requestAnimationFrame(() => {
      if (typeof EXERCISES_DATA !== 'undefined' && typeof initLibrary === 'function') {
        initLibrary();
      } else {
        libTab.innerHTML = '<p style="padding:2rem;color:red;">Lỗi: Không tải được dữ liệu bài tập!</p>';
      }
    });
  }
}

// =============================================
// ĐĂNG KÝ
// =============================================
async function register() {
  const fullName  = document.getElementById('reg-fullname')?.value?.trim();
  const username  = document.getElementById('reg-username')?.value?.trim();
  const password  = document.getElementById('reg-password')?.value;
  const password2 = document.getElementById('reg-password2')?.value;
  const errEl     = document.getElementById('reg-error');

  if (!fullName || !username || !password) {
    errEl.textContent = 'Vui lòng điền đầy đủ thông tin!'; return;
  }
  if (password !== password2) {
    errEl.textContent = 'Mật khẩu nhập lại không khớp!'; return;
  }
  if (password.length < 6) {
    errEl.textContent = 'Mật khẩu phải có ít nhất 6 ký tự!'; return;
  }

  try {
    const data = await apiRegister({ full_name: fullName, username, password });
    localStorage.setItem('gym_token', data.token);
    localStorage.setItem('gym_user', JSON.stringify(data.user));
    errEl.textContent = '';
    showApp();
  } catch (e) {
    errEl.textContent = e.message || 'Đăng ký thất bại!';
  }
}

// =============================================
// ĐĂNG NHẬP
// =============================================
async function login() {
  const username = document.getElementById('login-username')?.value?.trim();
  const password = document.getElementById('login-password')?.value;
  const errEl    = document.getElementById('login-error');

  if (!username || !password) {
    errEl.textContent = 'Vui lòng điền đầy đủ thông tin!'; return;
  }

  try {
    const data = await apiLogin({ username, password });
    localStorage.setItem('gym_token', data.token);
    localStorage.setItem('gym_user', JSON.stringify(data.user));
    errEl.textContent = '';
    showApp();
  } catch (e) {
    errEl.textContent = e.message || 'Đăng nhập thất bại!';
  }
}

// =============================================
// ĐĂNG XUẤT
// =============================================
function logout() {
  if (!confirm('Bạn có chắc muốn đăng xuất?')) return;
  localStorage.removeItem('gym_token');
  localStorage.removeItem('gym_user');
  showAuth();
}

// =============================================
// CHUYỂN GIỮA LOGIN / REGISTER
// =============================================
function showRegisterForm() {
  document.getElementById('login-form').style.display    = 'none';
  document.getElementById('register-form').style.display = 'block';
}

function showLoginForm() {
  document.getElementById('register-form').style.display = 'none';
  document.getElementById('login-form').style.display    = 'block';
}

// =============================================
// ENTER KEY SUBMIT
// =============================================
document.addEventListener('keydown', e => {
  if (e.key !== 'Enter') return;
  const activeEl = document.activeElement?.id;
  // Không kích hoạt nếu đang nhập chat
  if (activeEl === 'chat-input') return;

  const loginForm = document.getElementById('login-form');
  const regForm   = document.getElementById('register-form');
  if (loginForm?.style.display !== 'none') login();
  else if (regForm?.style.display !== 'none') register();
});

// =============================================
// CHATBOX AI
// =============================================
let chatHistory = [];
let chatOpen    = false;

function toggleChat() {
  chatOpen = !chatOpen;
  const box = document.getElementById('chat-box');
  const btn = document.getElementById('chat-toggle-btn');
  if (box) box.style.display = chatOpen ? 'flex' : 'none';
  if (btn) btn.textContent   = chatOpen ? '✕' : '💬';
}

function closeChat() {
  chatOpen = false;
  const box = document.getElementById('chat-box');
  const btn = document.getElementById('chat-toggle-btn');
  if (box) box.style.display = 'none';
  if (btn) btn.textContent   = '💬';
}

async function sendChat() {
  const input = document.getElementById('chat-input');
  const msg   = input?.value?.trim();
  if (!msg) return;

  input.value = '';
  appendChatMessage('user', msg);
  chatHistory.push({ role: 'user', content: msg });

  const typing = appendTypingIndicator();
  try {
    const res  = await apiChat(chatHistory);
    typing.remove();
    const text = res.reply || 'Xin lỗi, có lỗi xảy ra!';
    appendChatMessage('ai', text);
    chatHistory.push({ role: 'assistant', content: text });

    // Hiển thị YouTube nếu AI đề cập bài tập
    const keyword = extractExerciseKeyword(text);
    if (keyword) appendYouTubeVideo(keyword);
  } catch (e) {
    typing.remove();
    appendChatMessage('ai', 'Xin lỗi, có lỗi xảy ra. Vui lòng thử lại! 😅');
  }
}

function appendChatMessage(role, text) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;
  const div = document.createElement('div');
  div.className = `chat-msg chat-msg-${role}`;
  div.innerHTML = `<div class="chat-bubble">${formatChatText(text)}</div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function appendTypingIndicator() {
  const messages = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = 'chat-msg chat-msg-ai';
  div.innerHTML = `<div class="chat-bubble typing-indicator"><span></span><span></span><span></span></div>`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
  return div;
}

function formatChatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>');
}

function extractExerciseKeyword(text) {
  const exercises = [
    'bench press', 'squat', 'deadlift', 'pull up', 'chin up',
    'overhead press', 'lateral raise', 'barbell curl', 'tricep pushdown',
    'leg press', 'romanian deadlift', 'lunge', 'plank', 'crunch',
    'dumbbell flye', 'bent over row', 'lat pulldown', 'hammer curl',
    'skull crusher', 'calf raise', 'leg raise', 'russian twist',
    'face pull', 'incline bench'
  ];
  const lower = text.toLowerCase();
  return exercises.find(ex => lower.includes(ex)) || null;
}

function appendYouTubeVideo(keyword) {
  const messages = document.getElementById('chat-messages');
  if (!messages) return;

  const videoIds = {
    'bench press':       'SCVCLChPQFY',
    'squat':             'ultWZbUMPL8',
    'deadlift':          'op9kVnSso6Q',
    'pull up':           'eGo4IYlbE5g',
    'chin up':           'eGo4IYlbE5g',
    'overhead press':    '2yjwXTZQDDI',
    'lateral raise':     '3VcKaXpzqRo',
    'barbell curl':      'kwG2ipFRgfo',
    'tricep pushdown':   '2-LAMcpzODU',
    'leg press':         'IZxyjW7MPJQ',
    'romanian deadlift': 'JCXUYuzwNrM',
    'lunge':             'QOVaHwm-Q6U',
    'plank':             'pSHjTRCQxIw',
    'crunch':            'Xyd_fa5zoEU',
    'dumbbell flye':     'eozdVDA78K0',
    'bent over row':     'vT2GjY_Umpw',
    'lat pulldown':      'CAwf7n6Luuc',
    'hammer curl':       'zC3nLlEvin4',
    'skull crusher':     'd_KZxkY_0cM',
    'calf raise':        'gwLzBJYoWlI',
    'leg raise':         'l4kQd9eWclE',
    'russian twist':     'wkD8rjkodUI',
    'face pull':         'rep-qVOkqgk',
    'incline bench':     'DbFgADa2PL8',
  };

  const videoId    = videoIds[keyword] || null;
  const searchQ    = encodeURIComponent(keyword + ' hướng dẫn kỹ thuật');
  const youtubeUrl = `https://www.youtube.com/results?search_query=${searchQ}`;
  const thumbUrl   = videoId
    ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
    : `https://via.placeholder.com/320x180/ff0000/ffffff?text=YouTube`;

  const wrapper = document.createElement('div');
  wrapper.className = 'chat-video-wrapper';
  wrapper.innerHTML = `
    <div class="chat-video-label">🎬 Video hướng dẫn: <strong>${keyword}</strong></div>
    <a href="${youtubeUrl}" target="_blank" class="chat-video-thumb">
      <div class="chat-video-thumb-inner">
        <img src="${thumbUrl}" alt="${keyword}"
             onerror="this.src='https://via.placeholder.com/320x180/ff0000/ffffff?text=YouTube'">
        <div class="chat-video-play">▶</div>
      </div>
      <div class="chat-video-caption">Nhấn để xem video hướng dẫn <strong>${keyword}</strong></div>
    </a>
    <a href="${youtubeUrl}" target="_blank" class="chat-youtube-btn">
      🔍 Tìm kiếm "${keyword}" trên YouTube
    </a>
  `;
  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

// Gửi chat khi nhấn Enter (chỉ khi focus vào ô chat)
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.activeElement?.id === 'chat-input') {
    sendChat();
  }
});