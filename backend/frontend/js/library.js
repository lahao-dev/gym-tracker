// library.js - Thư viện bài tập

let currentCategory = 'Ngực';
let searchTimeout = null;

// =============================================
// KHỞI TẠO TRANG THƯ VIỆN
// =============================================
function initLibrary() {
  renderCategoryTabs();
  renderExerciseList(currentCategory);
}

// =============================================
// RENDER TABS DANH MỤC
// =============================================
function renderCategoryTabs() {
  const tabs = document.getElementById('lib-category-tabs');
  if (!tabs) return;
  const categories = Object.keys(EXERCISES_DATA);
  tabs.innerHTML = categories.map(cat => `
    <button class="lib-tab ${cat === currentCategory ? 'active' : ''}"
            onclick="switchCategory('${cat}')">
      ${getCategoryIcon(cat)} ${cat}
    </button>
  `).join('');
}

function getCategoryIcon(cat) {
  const icons = {
    'Ngực': '🏋️', 'Lưng': '🔙', 'Vai': '💪',
    'Tay': '💪', 'Chân': '🦵', 'Bụng': '🔥', 'Dãn Cơ': '🧘'
  };
  return icons[cat] || '💪';
}

// =============================================
// ĐỔI DANH MỤC
// =============================================
function switchCategory(cat) {
  currentCategory = cat;
  renderCategoryTabs();
  const query = document.getElementById('lib-search-input')?.value || '';
  if (query.trim()) {
    searchExercises(query);
  } else {
    renderExerciseList(cat);
  }
}

// =============================================
// RENDER DANH SÁCH BÀI TẬP
// =============================================
function renderExerciseList(category, exercises = null) {
  const container = document.getElementById('lib-exercise-list');
  if (!container) return;
  const list = exercises || EXERCISES_DATA[category] || [];
  if (list.length === 0) {
    container.innerHTML = `<div class="lib-empty">Không tìm thấy bài tập nào 🔍</div>`;
    return;
  }
  container.innerHTML = list.map(ex => `
    <div class="lib-exercise-card" onclick="openExerciseDetail('${ex.id}', '${getCategoryByExercise(ex.id)}')">
      <div class="lib-exercise-thumb">
        <img src="https://img.youtube.com/vi/${ex.youtubeId}/mqdefault.jpg"
             alt="${ex.name}"
             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
        <div class="lib-exercise-thumb-fallback">💪</div>
        <div class="lib-exercise-play">▶</div>
      </div>
      <div class="lib-exercise-info">
        <div class="lib-exercise-name">${ex.name}</div>
        <div class="lib-exercise-muscle">🎯 ${ex.muscle}</div>
        <div class="lib-exercise-meta">
          <span class="lib-badge difficulty-${ex.difficulty}">${ex.difficulty}</span>
          <span class="lib-badge equipment-badge">🏋️ ${ex.equipment}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function getCategoryByExercise(exerciseId) {
  for (const [cat, list] of Object.entries(EXERCISES_DATA)) {
    if (list.find(ex => ex.id === exerciseId)) return cat;
  }
  return 'Ngực';
}

// =============================================
// TÌM KIẾM BÀI TẬP
// =============================================
function searchExercises(query) {
  if (!query.trim()) {
    renderExerciseList(currentCategory);
    return;
  }
  const q = query.toLowerCase();
  const allExercises = Object.values(EXERCISES_DATA).flat();
  const results = allExercises.filter(ex =>
    ex.name.toLowerCase().includes(q) ||
    ex.muscle.toLowerCase().includes(q) ||
    ex.equipment.toLowerCase().includes(q)
  );
  renderExerciseList(null, results);
}

function onLibSearchInput(e) {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => searchExercises(e.target.value), 250);
}

// =============================================
// MỞ POPUP CHI TIẾT
// =============================================
function openExerciseDetail(exerciseId, category) {
  const list = EXERCISES_DATA[category] || Object.values(EXERCISES_DATA).flat();
  const ex = list.find(e => e.id === exerciseId)
           || Object.values(EXERCISES_DATA).flat().find(e => e.id === exerciseId);
  if (!ex) return;

  const modal = document.getElementById('exercise-detail-modal');
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(ex.name + ' hướng dẫn kỹ thuật')}`;

  document.getElementById('detail-title').textContent = ex.name;
  document.getElementById('detail-muscle').textContent = ex.muscle;
  document.getElementById('detail-difficulty').textContent = ex.difficulty;
  document.getElementById('detail-difficulty').className = `detail-badge difficulty-${ex.difficulty}`;
  document.getElementById('detail-equipment').textContent = ex.equipment;

  // Thumbnail + link YouTube
  const thumb = document.getElementById('detail-thumbnail');
  thumb.innerHTML = `
    <a href="${youtubeUrl}" target="_blank" class="detail-thumb-link">
      <img src="https://img.youtube.com/vi/${ex.youtubeId}/mqdefault.jpg"
           alt="${ex.name}"
           onerror="this.src='https://via.placeholder.com/320x180?text=YouTube'">
      <div class="detail-thumb-play">▶</div>
    </a>
    <a href="${youtubeUrl}" target="_blank" class="detail-youtube-btn">
      🎬 Xem video hướng dẫn trên YouTube
    </a>
  `;

  // Các bước
  document.getElementById('detail-steps').innerHTML = ex.steps.map((s, i) =>
    `<li><span class="step-num">${i + 1}</span>${s}</li>`
  ).join('');

  // Lưu ý
  document.getElementById('detail-tips').innerHTML = ex.tips.map(t =>
    `<li>⚠️ ${t}</li>`
  ).join('');

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeExerciseDetail() {
  const modal = document.getElementById('exercise-detail-modal');
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

// =============================================
// HÀM TÌM KIẾM DÙNG TRONG WORKOUT FORM
// =============================================
function searchExercisesForForm(query, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  if (!dropdown) return;
  if (!query.trim()) { dropdown.innerHTML = ''; dropdown.style.display = 'none'; return; }
  const q = query.toLowerCase();
  const all = Object.values(EXERCISES_DATA).flat();
  const results = all.filter(ex => ex.name.toLowerCase().includes(q)).slice(0, 8);
  if (results.length === 0) { dropdown.innerHTML = ''; dropdown.style.display = 'none'; return; }
  dropdown.innerHTML = results.map(ex => `
    <div class="exercise-dropdown-item" onclick="selectExerciseFromLibrary('${ex.id}', '${ex.name}', '${dropdownId}')">
      <span class="dropdown-item-name">${ex.name}</span>
      <span class="dropdown-item-muscle">${ex.muscle}</span>
    </div>
  `).join('');
  dropdown.style.display = 'block';
}

function selectExerciseFromLibrary(exerciseId, exerciseName, dropdownId) {
  const dropdown = document.getElementById(dropdownId);
  // Điền tên vào ô input
  const input = dropdown?.previousElementSibling;
  if (input) input.value = exerciseName;
  if (dropdown) { dropdown.innerHTML = ''; dropdown.style.display = 'none'; }
}

// Đóng dropdown khi click ra ngoài
document.addEventListener('click', e => {
  if (!e.target.closest('.exercise-name-wrapper')) {
    document.querySelectorAll('.exercise-dropdown').forEach(d => {
      d.style.display = 'none';
    });
  }
});