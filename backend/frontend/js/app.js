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
  const loginForm = document.getElementById('login-form');
  const regForm   = document.getElementById('register-form');
  const tabs      = document.querySelectorAll('.tab-btn');

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

  renderCalendar();
  loadWorkoutDates();
  loadWorkoutForDate(selectedDate);
}

// =============================================
// CHATBOX AI
// =============================================
let chatMessages = [];
let chatOpen = false;

// Tạo giao diện chatbox
function createChatbox() {
  const chatHTML = `
    <button id="chat-toggle-btn" onclick="toggleChat()">
      💬
      <span id="chat-badge" class="chat-badge hidden">!</span>
    </button>

    <div id="chatbox" class="chatbox hidden">
      <div class="chat-header">
        <div class="chat-header-info">
          <span class="chat-avatar">🤖</span>
          <div>
            <div class="chat-name">AI Gym Assistant</div>
            <div class="chat-status">Powered by Groq AI</div>
          </div>
        </div>
        <button class="chat-close-btn" onclick="toggleChat()">✕</button>
      </div>

      <div id="chat-messages" class="chat-messages">
        <div class="chat-bubble ai">
          Xin chào! Mình là AI Gym Assistant 💪<br>
          Mình có thể giúp bạn:<br>
          • Gợi ý bài tập theo nhóm cơ<br>
          • Lên lịch tập theo tuần<br>
          • Hướng dẫn kỹ thuật tập đúng cách<br>
          • Tư vấn mức tạ phù hợp<br><br>
          Bạn cần hỗ trợ gì? 😊
        </div>
      </div>

      <div class="chat-input-area">
        <input
          type="text"
          id="chat-input"
          placeholder="Nhập câu hỏi..."
          onkeydown="if(event.key==='Enter') sendChat()"
        />
        <button class="chat-send-btn" onclick="sendChat()">➤</button>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = chatHTML;
  document.body.appendChild(container);
}

// Mở/đóng chatbox
function toggleChat() {
  chatOpen = !chatOpen;
  const chatbox = document.getElementById('chatbox');
  const badge   = document.getElementById('chat-badge');

  if (chatOpen) {
    chatbox.classList.remove('hidden');
    badge.classList.add('hidden');
    document.getElementById('chat-input').focus();
  } else {
    chatbox.classList.add('hidden');
  }
}

// Gửi tin nhắn
async function sendChat() {
  const input = document.getElementById('chat-input');
  const text  = input.value.trim();
  if (!text) return;

  appendChatBubble(text, 'user');
  chatMessages.push({ role: 'user', content: text });
  input.value = '';

  const typingId = appendTyping();

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({ messages: chatMessages })
    });

    const data = await res.json();
    removeTyping(typingId);

    if (data.error) throw new Error(data.error);

    appendChatBubble(data.reply, 'ai');
    chatMessages.push({ role: 'assistant', content: data.reply });

    // Nếu có video keyword → hiện video YouTube
    if (data.videoKeyword) {
      appendYouTubeVideo(data.videoKeyword);
    }

    if (!chatOpen) {
      document.getElementById('chat-badge').classList.remove('hidden');
    }
  } catch (err) {
    removeTyping(typingId);
    appendChatBubble('Xin lỗi, có lỗi xảy ra. Vui lòng thử lại! 😅', 'ai');
  }
}

// Thêm bubble tin nhắn
function appendChatBubble(text, role) {
  const messages = document.getElementById('chat-messages');
  const bubble   = document.createElement('div');
  bubble.className = `chat-bubble ${role}`;
  bubble.innerHTML = text.replace(/\n/g, '<br>');
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

// =============================================
// HIỂN THỊ VIDEO YOUTUBE (không dùng iframe)
// =============================================
function appendYouTubeVideo(keyword) {
  const messages    = document.getElementById('chat-messages');
  const searchQuery = encodeURIComponent(keyword + ' hướng dẫn kỹ thuật');
  const youtubeUrl  = `https://www.youtube.com/results?search_query=${searchQuery}`;

  // Dùng thumbnail ảnh tĩnh thay vì iframe (tránh bị chặn)
  const thumbnailUrl = `https://img.youtube.com/vi/gRVjAtPip0Y/mqdefault.jpg`;

  const wrapper = document.createElement('div');
  wrapper.className = 'chat-video-wrapper';
  wrapper.innerHTML = `
    <div class="chat-video-label">🎬 Video hướng dẫn: <strong>${keyword}</strong></div>
    <a href="${youtubeUrl}" target="_blank" class="chat-video-thumb">
      <div class="chat-video-thumb-inner">
        <img
          src="${thumbnailUrl}"
          alt="${keyword}"
        />
        <div class="chat-video-play">▶</div>
      </div>
      <div class="chat-video-caption">
        Nhấn để xem video hướng dẫn <strong>${keyword}</strong> trên YouTube
      </div>
    </a>
    <a href="${youtubeUrl}" target="_blank" class="chat-youtube-btn">
      🔍 Tìm kiếm "${keyword}" trên YouTube
    </a>
  `;

  messages.appendChild(wrapper);
  messages.scrollTop = messages.scrollHeight;
}

// Hiện typing indicator
function appendTyping() {
  const messages = document.getElementById('chat-messages');
  const id       = 'typing-' + Date.now();
  const typing   = document.createElement('div');
  typing.className = 'chat-bubble ai typing';
  typing.id        = id;
  typing.innerHTML = '<span></span><span></span><span></span>';
  messages.appendChild(typing);
  messages.scrollTop = messages.scrollHeight;
  return id;
}

// Xóa typing indicator
function removeTyping(id) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

// Khởi tạo chatbox khi trang load xong
document.addEventListener('DOMContentLoaded', createChatbox);