// workout.js - Quản lý buổi tập (sao chép luôn hiện, tên bài tập có dropdown từ thư viện)

let currentWorkout   = null;
let currentDateStr   = null;
let copiedExercises  = null;  // Buổi tập đang được sao chép

// =============================================
// TẢI BUỔI TẬP THEO NGÀY
// =============================================
async function loadWorkoutForDate(dateStr) {
  currentDateStr = dateStr;
  updateDateTitle(dateStr);

  try {
    const data = await apiGetWorkoutByDate(dateStr);
    currentWorkout = data;
    renderWorkout(data);
  } catch (e) {
    currentWorkout = null;
    renderWorkout(null);
  }
}

function updateDateTitle(dateStr) {
  const el = document.getElementById('workout-date-title');
  if (!el) return;
  const d = new Date(dateStr + 'T00:00:00');
  const days = ['Chủ Nhật','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'];
  el.textContent = `${days[d.getDay()]}, ${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
}

// =============================================
// RENDER BUỔI TẬP
// =============================================
function renderWorkout(workout) {
  const container = document.getElementById('workout-container');
  if (!container) return;

  const exercises = workout?.exercises || [];
  const hasExercises = exercises.length > 0;

  container.innerHTML = `
    <!-- Nút sao chép: LUÔN hiển thị, kể cả khi chưa có bài tập -->
    <div class="copy-section">
      ${copiedExercises
        ? `<div class="copy-info">📋 Đã sao chép ${copiedExercises.length} bài — <button class="btn-paste" onclick="pasteWorkout()">Dán vào ngày này</button> <button class="btn-clear-copy" onclick="clearCopy()">✕ Bỏ</button></div>`
        : `<button class="btn-copy-day" onclick="copyWorkout()" ${!hasExercises ? 'disabled title="Không có bài tập để sao chép"' : ''}>
             📋 Sao chép buổi tập ngày này
           </button>`
      }
    </div>

    <!-- Ghi chú buổi tập -->
    <div class="workout-note-section">
      <textarea id="workout-note" placeholder="Ghi chú buổi tập (tùy chọn)..."
                rows="2">${workout?.notes || ''}</textarea>
    </div>

    <!-- Danh sách bài tập -->
    <div id="exercise-list">
      ${hasExercises
        ? exercises.map(ex => renderExerciseCard(ex)).join('')
        : `<div class="no-exercise-msg">
             <p>📭 Chưa có bài tập nào.</p>
             <p class="hint">Bấm <strong>"+ Thêm bài tập"</strong> hoặc sao chép từ ngày khác.</p>
           </div>`
      }
    </div>

    <!-- Đánh giá buổi tập -->
    ${hasExercises ? `
    <div class="workout-rating">
      <span>Đánh giá buổi tập:</span>
      <div class="star-rating">
        ${[1,2,3,4,5].map(s => `
          <span class="star ${s <= (workout?.rating || 0) ? 'active' : ''}"
                onclick="setRating(${s})">★</span>
        `).join('')}
      </div>
    </div>` : ''}

    <!-- Nút thêm bài tập -->
    <button class="btn-add-exercise" onclick="showAddExerciseForm()">
      + Thêm bài tập
    </button>

    <!-- Form thêm bài tập (ẩn mặc định) -->
    <div id="add-exercise-form" class="add-exercise-form" style="display:none;">
      ${renderAddExerciseForm()}
    </div>
  `;
}

// =============================================
// CARD BÀI TẬP
// =============================================
function renderExerciseCard(ex) {
  const sets = JSON.parse(ex.sets_data || '[]');
  return `
    <div class="exercise-card" id="ex-card-${ex.id}">
      <div class="exercise-card-header">
        <span class="exercise-card-name">${ex.name}</span>
        <div class="exercise-card-actions">
          <button class="btn-icon" onclick="editExercise(${ex.id})" title="Sửa">✏️</button>
          <button class="btn-icon btn-danger" onclick="deleteExercise(${ex.id})" title="Xóa">🗑️</button>
        </div>
      </div>
      <div class="exercise-card-meta">
        ${ex.weight_kg ? `<span>⚖️ ${ex.weight_kg}kg</span>` : ''}
        ${ex.rest_seconds ? `<span>⏱️ Nghỉ ${ex.rest_seconds}s</span>` : ''}
      </div>
      ${ex.notes ? `<div class="exercise-card-note">📝 ${ex.notes}</div>` : ''}

      <!-- Sets -->
      <div class="sets-container">
        ${sets.map((set, i) => `
          <div class="set-row ${set.completed ? 'completed' : ''}">
            <span class="set-label">Set ${i+1}</span>
            <span class="set-info">${set.reps} rep${set.weight ? ` × ${set.weight}kg` : ''}</span>
            <button class="btn-tick ${set.completed ? 'ticked' : ''}"
                    onclick="toggleSet(${ex.id}, ${i})">
              ${set.completed ? '✅' : '⬜'}
            </button>
          </div>
        `).join('')}
        <button class="btn-add-set" onclick="addSet(${ex.id})">+ Thêm set</button>
      </div>
    </div>
  `;
}

// =============================================
// FORM THÊM BÀI TẬP (tên bài có dropdown từ thư viện)
// =============================================
function renderAddExerciseForm(existing = null) {
  const uid = Date.now();
  const dropdownId = `ex-dropdown-${uid}`;
  return `
    <div class="add-form-inner">
      <h4>${existing ? '✏️ Sửa bài tập' : '+ Thêm bài tập mới'}</h4>

      <!-- Ô tìm kiếm tên bài tập -->
      <div class="form-group exercise-name-wrapper">
        <label>Tên bài tập *</label>
        <input type="text" id="ex-name" placeholder="Tìm bài tập từ thư viện..."
               value="${existing?.name || ''}"
               oninput="searchExercisesForForm(this.value, '${dropdownId}')"
               autocomplete="off">
        <div class="exercise-dropdown" id="${dropdownId}"></div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Số set</label>
          <input type="number" id="ex-sets" min="1" max="20" value="${existing?.num_sets || 3}">
        </div>
        <div class="form-group">
          <label>Số rep / set</label>
          <input type="number" id="ex-reps" min="1" max="100" value="${existing?.num_reps || 10}">
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label>Mức tạ (kg)</label>
          <input type="number" id="ex-weight" min="0" step="0.5" value="${existing?.weight_kg || ''}">
        </div>
        <div class="form-group">
          <label>Nghỉ (giây)</label>
          <input type="number" id="ex-rest" min="0" value="${existing?.rest_seconds || 60}">
        </div>
      </div>

      <div class="form-group">
        <label>Ghi chú</label>
        <input type="text" id="ex-note" placeholder="Ví dụ: Tăng 5kg so với tuần trước"
               value="${existing?.notes || ''}">
      </div>

      <div class="form-actions">
        <button class="btn-save-exercise" onclick="${existing ? `saveEditExercise(${existing.id})` : 'saveNewExercise()'}">
          💾 Lưu
        </button>
        <button class="btn-cancel-exercise" onclick="hideAddExerciseForm()">Hủy</button>
      </div>
    </div>
  `;
}

// =============================================
// HIỆN / ẨN FORM
// =============================================
function showAddExerciseForm() {
  const form = document.getElementById('add-exercise-form');
  if (form) {
    form.innerHTML = renderAddExerciseForm();
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function hideAddExerciseForm() {
  const form = document.getElementById('add-exercise-form');
  if (form) form.style.display = 'none';
}

// =============================================
// LƯU BÀI TẬP MỚI
// =============================================
async function saveNewExercise() {
  const name    = document.getElementById('ex-name')?.value?.trim();
  const numSets = parseInt(document.getElementById('ex-sets')?.value) || 3;
  const numReps = parseInt(document.getElementById('ex-reps')?.value) || 10;
  const weight  = parseFloat(document.getElementById('ex-weight')?.value) || 0;
  const rest    = parseInt(document.getElementById('ex-rest')?.value) || 60;
  const note    = document.getElementById('ex-note')?.value?.trim() || '';

  if (!name) { alert('Vui lòng nhập tên bài tập!'); return; }

  // Tạo buổi tập nếu chưa có
  if (!currentWorkout) {
    try {
      currentWorkout = await apiCreateWorkout({ date: currentDateStr, notes: '', rating: 0 });
      workoutDates[currentDateStr] = true;
    } catch (e) { alert('Lỗi tạo buổi tập!'); return; }
  }

  // Tạo sets data
  const setsData = Array.from({ length: numSets }, () => ({
    reps: numReps, weight: weight, completed: false
  }));

  try {
    await apiCreateExercise({
      workout_id: currentWorkout.id,
      name, num_sets: numSets, num_reps: numReps,
      weight_kg: weight, rest_seconds: rest,
      notes: note, sets_data: JSON.stringify(setsData)
    });
    await loadWorkoutForDate(currentDateStr);
    await refreshCalendarAfterSave(currentDateStr);
  } catch (e) { alert('Lỗi lưu bài tập!'); }
}

// =============================================
// SỬA BÀI TẬP
// =============================================
function editExercise(exerciseId) {
  const ex = currentWorkout?.exercises?.find(e => e.id === exerciseId);
  if (!ex) return;
  const form = document.getElementById('add-exercise-form');
  if (form) {
    form.innerHTML = renderAddExerciseForm(ex);
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

async function saveEditExercise(exerciseId) {
  const name   = document.getElementById('ex-name')?.value?.trim();
  const weight = parseFloat(document.getElementById('ex-weight')?.value) || 0;
  const rest   = parseInt(document.getElementById('ex-rest')?.value) || 60;
  const note   = document.getElementById('ex-note')?.value?.trim() || '';

  if (!name) { alert('Vui lòng nhập tên bài tập!'); return; }

  try {
    await apiUpdateExercise(exerciseId, { name, weight_kg: weight, rest_seconds: rest, notes: note });
    await loadWorkoutForDate(currentDateStr);
  } catch (e) { alert('Lỗi sửa bài tập!'); }
}

// =============================================
// XÓA BÀI TẬP
// =============================================
async function deleteExercise(exerciseId) {
  if (!confirm('Xóa bài tập này?')) return;
  try {
    await apiDeleteExercise(exerciseId);
    await loadWorkoutForDate(currentDateStr);
    await refreshCalendarAfterSave(currentDateStr);
  } catch (e) { alert('Lỗi xóa bài tập!'); }
}

// =============================================
// TICK / UNTICK SET
// =============================================
async function toggleSet(exerciseId, setIndex) {
  const ex = currentWorkout?.exercises?.find(e => e.id === exerciseId);
  if (!ex) return;
  const sets = JSON.parse(ex.sets_data || '[]');
  if (!sets[setIndex]) return;
  sets[setIndex].completed = !sets[setIndex].completed;
  try {
    await apiUpdateExercise(exerciseId, { sets_data: JSON.stringify(sets) });
    ex.sets_data = JSON.stringify(sets);
    // Cập nhật card mà không reload toàn bộ
    const card = document.getElementById(`ex-card-${exerciseId}`);
    if (card) card.outerHTML = renderExerciseCard(ex);
  } catch (e) { console.error(e); }
}

// =============================================
// THÊM SET
// =============================================
async function addSet(exerciseId) {
  const ex = currentWorkout?.exercises?.find(e => e.id === exerciseId);
  if (!ex) return;
  const sets = JSON.parse(ex.sets_data || '[]');
  const lastSet = sets[sets.length - 1] || { reps: 10, weight: 0 };
  sets.push({ reps: lastSet.reps, weight: lastSet.weight, completed: false });
  try {
    await apiUpdateExercise(exerciseId, { sets_data: JSON.stringify(sets) });
    ex.sets_data = JSON.stringify(sets);
    const card = document.getElementById(`ex-card-${exerciseId}`);
    if (card) card.outerHTML = renderExerciseCard(ex);
  } catch (e) { console.error(e); }
}

// =============================================
// ĐÁNH GIÁ SAO
// =============================================
async function setRating(rating) {
  if (!currentWorkout) return;
  try {
    await apiUpdateWorkout(currentWorkout.id, { rating });
    currentWorkout.rating = rating;
    // Cập nhật sao hiển thị
    document.querySelectorAll('.star').forEach((el, i) => {
      el.classList.toggle('active', i < rating);
    });
  } catch (e) { console.error(e); }
}

// =============================================
// SAO CHÉP / DÁN BUỔI TẬP
// =============================================
function copyWorkout() {
  if (!currentWorkout?.exercises?.length) {
    alert('Không có bài tập nào để sao chép!');
    return;
  }
  copiedExercises = currentWorkout.exercises.map(ex => ({ ...ex }));
  alert(`✅ Đã sao chép ${copiedExercises.length} bài tập! Chọn ngày khác rồi bấm "Dán vào ngày này".`);
  renderWorkout(currentWorkout); // cập nhật UI nút
}

async function pasteWorkout() {
  if (!copiedExercises?.length) return;
  if (!confirm(`Dán ${copiedExercises.length} bài tập vào ngày ${currentDateStr}?`)) return;

  // Tạo buổi tập nếu chưa có
  if (!currentWorkout) {
    try {
      currentWorkout = await apiCreateWorkout({ date: currentDateStr, notes: '', rating: 0 });
      workoutDates[currentDateStr] = true;
    } catch (e) { alert('Lỗi tạo buổi tập!'); return; }
  }

  try {
    for (const ex of copiedExercises) {
      const setsData = Array.from({ length: ex.num_sets || 3 }, () => ({
        reps: ex.num_reps || 10, weight: ex.weight_kg || 0, completed: false
      }));
      await apiCreateExercise({
        workout_id: currentWorkout.id,
        name: ex.name, num_sets: ex.num_sets, num_reps: ex.num_reps,
        weight_kg: ex.weight_kg, rest_seconds: ex.rest_seconds,
        notes: ex.notes, sets_data: JSON.stringify(setsData)
      });
    }
    copiedExercises = null;
    await loadWorkoutForDate(currentDateStr);
    await refreshCalendarAfterSave(currentDateStr);
  } catch (e) { alert('Lỗi dán buổi tập!'); }
}

function clearCopy() {
  copiedExercises = null;
  renderWorkout(currentWorkout);
}