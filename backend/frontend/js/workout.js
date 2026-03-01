// workout.js - Quản lý buổi tập và bài tập

let currentWorkout  = null; // Buổi tập đang hiển thị
let currentRating   = 0;
let editingExId     = null; // ID bài tập đang sửa (null = thêm mới)

// =============================================
// TẢI THÔNG TIN BUỔI TẬP THEO NGÀY
// =============================================
async function loadWorkoutForDate(dateStr) {
  // Cập nhật tiêu đề
  const [y, m, d] = dateStr.split('-');
  const dateObj = new Date(y, m - 1, d);
  const title = dateObj.toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  document.getElementById('workout-date-title').textContent = title;

  try {
    currentWorkout = await api.getWorkout(dateStr);
    renderWorkout();
  } catch (e) {
    console.error('Lỗi tải buổi tập:', e);
  }
}

// =============================================
// RENDER DANH SÁCH BÀI TẬP
// =============================================
function renderWorkout() {
  const content = document.getElementById('workout-content');
  const actions = document.getElementById('workout-actions');
  const ratingEl = document.getElementById('workout-rating');
  const chartEl  = document.getElementById('chart-section');

  if (!currentWorkout) {
    // Chưa có buổi tập ngày này
    content.innerHTML = `
      <div class="empty-state">
        <p>Ngày này chưa có buổi tập</p>
        <br>
        <button class="btn-add-exercise" onclick="openAddExercise()">+ Thêm bài tập đầu tiên</button>
      </div>`;
    actions.style.display = 'none';
    ratingEl.classList.add('hidden');
    chartEl.classList.add('hidden');
    return;
  }

  actions.style.display = 'flex';
  ratingEl.classList.remove('hidden');
  chartEl.classList.remove('hidden');

  const exercises = currentWorkout.exercises || [];

  // Render danh sách bài tập
  let listHTML = `<div class="exercise-list">`;
  if (exercises.length === 0) {
    listHTML += `<p style="color:var(--gray-500); text-align:center; padding:1rem">Chưa có bài tập nào</p>`;
  } else {
    exercises.forEach(ex => {
      const doneClass = ex.completed ? 'done' : '';
      const cardClass = ex.completed ? 'completed' : '';
      listHTML += `
        <div class="exercise-card ${cardClass}" id="ex-card-${ex.id}">
          <div class="ex-check ${doneClass}" onclick="toggleComplete(${ex.id}, ${ex.completed})">
            ${ex.completed ? '✓' : ''}
          </div>
          <div class="ex-info">
            <div class="ex-name">${ex.name}</div>
            <div class="ex-details">
              ${ex.sets} set × ${ex.reps} rep · ${ex.weight_kg} kg · nghỉ ${ex.rest_seconds}s
            </div>
            ${ex.notes ? `<div class="ex-notes-text">📝 ${ex.notes}</div>` : ''}
          </div>
          <div class="ex-btns">
            <button class="btn-icon btn-edit" onclick="openEditExercise(${ex.id})" title="Sửa">✏️</button>
            <button class="btn-icon btn-del" onclick="deleteExercise(${ex.id})" title="Xóa">🗑️</button>
          </div>
        </div>`;
    });
  }
  listHTML += `</div>`;
  listHTML += `<button class="btn-add-exercise" onclick="openAddExercise()">+ Thêm bài tập</button>`;
  content.innerHTML = listHTML;

  // Đánh giá
  currentRating = currentWorkout.rating || 0;
  renderStars();
  document.getElementById('workout-notes').value = currentWorkout.notes || '';

  // Cập nhật select cho biểu đồ
  const select = document.getElementById('chart-exercise-select');
  const uniqueNames = [...new Set(exercises.map(e => e.name))];
  const currentVal = select.value;
  select.innerHTML = '<option value="">-- Chọn bài tập --</option>' +
    uniqueNames.map(n => `<option value="${n}" ${n === currentVal ? 'selected' : ''}>${n}</option>`).join('');
  if (currentVal) loadChart();
}

// =============================================
// TICK HOÀN THÀNH BÀI TẬP
// =============================================
async function toggleComplete(id, currentStatus) {
  try {
    await api.updateExercise(id, { completed: currentStatus ? 0 : 1 });
    await refreshCurrentWorkout();
  } catch (e) { alert('Lỗi: ' + e.message); }
}

// =============================================
// XÓA BUỔI TẬP
// =============================================
async function deleteWorkout() {
  if (!currentWorkout) return;
  if (!confirm('Xóa toàn bộ buổi tập ngày này?')) return;
  try {
    await api.deleteWorkout(currentWorkout.id);
    currentWorkout = null;
    workoutDates.delete(selectedDate);
    renderCalendar();
    updateMonthStats();
    renderWorkout();
  } catch (e) { alert('Lỗi: ' + e.message); }
}

// =============================================
// XÓA BÀI TẬP
// =============================================
async function deleteExercise(id) {
  if (!confirm('Xóa bài tập này?')) return;
  try {
    await api.deleteExercise(id);
    await refreshCurrentWorkout();
  } catch (e) { alert('Lỗi: ' + e.message); }
}

// =============================================
// LƯU GHI CHÚ VÀ ĐÁNH GIÁ BUỔI TẬP
// =============================================
async function saveWorkoutInfo() {
  const notes = document.getElementById('workout-notes').value;
  try {
    await api.saveWorkout({ date: selectedDate, notes, rating: currentRating });
    await refreshCurrentWorkout();
    // Thông báo nhỏ
    const btn = document.querySelector('.btn-save');
    btn.textContent = '✅ Đã lưu!';
    setTimeout(() => btn.textContent = '💾 Lưu ghi chú', 1500);
  } catch (e) { alert('Lỗi: ' + e.message); }
}

// =============================================
// MODAL THÊM / SỬA BÀI TẬP
// =============================================
function openAddExercise() {
  editingExId = null;
  document.getElementById('modal-title').textContent = 'Thêm bài tập';
  document.getElementById('ex-name').value   = '';
  document.getElementById('ex-sets').value   = '3';
  document.getElementById('ex-reps').value   = '10';
  document.getElementById('ex-weight').value = '0';
  document.getElementById('ex-rest').value   = '60';
  document.getElementById('ex-notes').value  = '';
  document.getElementById('modal-error').textContent = '';
  openModal('exercise-modal');
}

function openEditExercise(id) {
  const ex = currentWorkout.exercises.find(e => e.id === id);
  if (!ex) return;
  editingExId = id;
  document.getElementById('modal-title').textContent = 'Sửa bài tập';
  document.getElementById('ex-name').value   = ex.name;
  document.getElementById('ex-sets').value   = ex.sets;
  document.getElementById('ex-reps').value   = ex.reps;
  document.getElementById('ex-weight').value = ex.weight_kg;
  document.getElementById('ex-rest').value   = ex.rest_seconds;
  document.getElementById('ex-notes').value  = ex.notes || '';
  document.getElementById('modal-error').textContent = '';
  openModal('exercise-modal');
}

async function saveExercise() {
  const name   = document.getElementById('ex-name').value.trim();
  const sets   = parseInt(document.getElementById('ex-sets').value);
  const reps   = parseInt(document.getElementById('ex-reps').value);
  const weight = parseFloat(document.getElementById('ex-weight').value);
  const rest   = parseInt(document.getElementById('ex-rest').value);
  const notes  = document.getElementById('ex-notes').value.trim();
  const errEl  = document.getElementById('modal-error');

  if (!name) { errEl.textContent = 'Vui lòng nhập tên bài tập!'; return; }

  try {
    if (editingExId) {
      // Sửa bài tập
      await api.updateExercise(editingExId, { name, sets, reps, weight_kg: weight, rest_seconds: rest, notes });
    } else {
      // Thêm mới — đảm bảo có buổi tập
      let workout = currentWorkout;
      if (!workout) {
        workout = await api.saveWorkout({ date: selectedDate, notes: '', rating: 0 });
        workoutDates.add(selectedDate);
        renderCalendar();
        updateMonthStats();
      }
      await api.addExercise({ workout_id: workout.id, name, sets, reps, weight_kg: weight, rest_seconds: rest, notes });
    }
    closeModal('exercise-modal');
    await refreshCurrentWorkout();
  } catch (e) {
    errEl.textContent = 'Lỗi: ' + e.message;
  }
}

// =============================================
// SAO CHÉP LỊCH TẬP
// =============================================
function openCopyModal() {
  document.getElementById('copy-to-date').textContent = selectedDate;
  document.getElementById('copy-from-date').value = '';
  document.getElementById('copy-error').textContent = '';
  openModal('copy-modal');
}

async function copyWorkout() {
  const fromDate = document.getElementById('copy-from-date').value;
  const errEl = document.getElementById('copy-error');
  if (!fromDate) { errEl.textContent = 'Vui lòng chọn ngày nguồn!'; return; }
  if (fromDate === selectedDate) { errEl.textContent = 'Ngày nguồn và đích không được trùng!'; return; }

  try {
    const result = await api.copyWorkout({ from_date: fromDate, to_date: selectedDate });
    currentWorkout = result;
    workoutDates.add(selectedDate);
    renderCalendar();
    updateMonthStats();
    renderWorkout();
    closeModal('copy-modal');
  } catch (e) {
    errEl.textContent = 'Lỗi: ' + e.message;
  }
}

// =============================================
// ĐÁNH GIÁ SAO
// =============================================
function renderStars() {
  const container = document.getElementById('stars-container');
  container.innerHTML = '';
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement('span');
    star.className = 'star' + (i <= currentRating ? ' active' : '');
    star.textContent = '⭐';
    star.onclick = () => { currentRating = i; renderStars(); };
    container.appendChild(star);
  }
}

// =============================================
// HELPERS
// =============================================
async function refreshCurrentWorkout() {
  currentWorkout = await api.getWorkout(selectedDate);
  renderWorkout();
}

function openModal(id) {
  document.getElementById(id).classList.remove('hidden');
  document.getElementById('overlay').classList.remove('hidden');
}

function closeModal(id) {
  document.getElementById(id).classList.add('hidden');
  document.getElementById('overlay').classList.add('hidden');
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.add('hidden'));
  document.getElementById('overlay').classList.add('hidden');
}