// ===== Biến toàn cục =====
let birthDateInput, birthYearInput, calcBtn, resultSection, resultCard;

const CURRENT_YEAR = new Date().getFullYear();

const MILESTONES = [
  { age: 14, label: "Cấp thẻ Căn cước lần đầu" },
  { age: 25, label: "Cấp đổi thẻ Căn cước" },
  { age: 40, label: "Cấp đổi thẻ Căn cước" },
  { age: 60, label: "Cấp đổi thẻ Căn cước (lần cuối)" }
];

const WINDOW_YEARS = 2;

// ===== Helpers xử lý ngày tháng =====
function startOfDay(d) {
  const n = new Date(d);
  n.setHours(0, 0, 0, 0);
  return n;
}

function addYears(d, years) {
  const n = new Date(d);
  n.setFullYear(n.getFullYear() + years);
  return n;
}

function formatDate(d) {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// Parse "YYYY-MM-DD" tránh lỗi timezone (không dùng new Date(str) trực tiếp)
function parseDateInput(str) {
  const [y, m, d] = str.split('-').map(Number);
  return new Date(y, m - 1, d);
}

// Tính tuổi chính xác theo ngày
function calcAge(birthDate, today) {
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

// ===== Khởi tạo =====
document.addEventListener('DOMContentLoaded', () => {
  birthDateInput = document.getElementById('birthDate');
  birthYearInput = document.getElementById('birthYear');
  calcBtn = document.getElementById('calcBtn');
  resultSection = document.getElementById('resultSection');
  resultCard = document.getElementById('resultCard');

  // Chặn chọn ngày sinh trong tương lai
  const today = new Date().toISOString().split('T')[0];
  birthDateInput.max = today;

  // Toggle chế độ nhập
  document.querySelectorAll('input[name="birthMode"]').forEach((radio) => {
    radio.addEventListener('change', (e) => {
      if (!e.target.checked) return;
      toggleMode(e.target.value);
      resultSection.classList.add('hidden');
    });
  });

  // Nút tính
  calcBtn.addEventListener('click', handleCalculate);

  // Enter trên date / year input
  birthDateInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCalculate();
  });
  birthYearInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleCalculate();
  });

  // Auto-calc khi chọn date xong
  birthDateInput.addEventListener('change', () => {
    if (birthDateInput.value) handleCalculate();
  });

  // Auto-calc khi nhập đủ 4 số năm sinh
  birthYearInput.addEventListener('input', () => {
    const val = birthYearInput.value.trim();
    if (val.length === 4) {
      handleCalculate();
    } else {
      resultSection.classList.add('hidden');
    }
  });

  renderMilestoneTable();
});

// ===== Chuyển đổi chế độ nhập =====
function toggleMode(mode) {
  if (mode === 'full') {
    birthDateInput.classList.remove('hidden');
    birthYearInput.classList.add('hidden');
  } else {
    birthDateInput.classList.add('hidden');
    birthYearInput.classList.remove('hidden');
  }
}

// ===== Render bảng mốc tuổi tự động =====
function renderMilestoneTable() {
  const tbody = document.getElementById('milestoneTableBody');
  const header = document.getElementById('birthYearHeader');
  if (!tbody) return;

  if (header) {
    header.textContent = `Năm sinh cần đổi (${CURRENT_YEAR})`;
  }

  tbody.innerHTML = MILESTONES.map((m) => {
    const birthYear = CURRENT_YEAR - m.age;
    const windowAgeStart = m.age - WINDOW_YEARS;
    const windowAgeEnd = m.age - 1;
    const windowText = `${windowAgeStart} – ${windowAgeEnd} tuổi (2 năm trước mốc)`;

    return `
      <tr>
        <td>${m.age} tuổi</td>
        <td>${m.label}</td>
        <td>${windowText}</td>
        <td>${birthYear}</td>
      </tr>
    `;
  }).join('');
}

// ===== Lấy ngày sinh từ input theo chế độ =====
function getBirthDateFromInput() {
  const mode = document.querySelector('input[name="birthMode"]:checked').value;

  if (mode === 'full') {
    const v = birthDateInput.value;
    if (!v) {
      showResult(`<div class="alert warning">Vui lòng chọn ngày sinh của bạn.</div>`);
      return null;
    }
    return { date: startOfDay(parseDateInput(v)), mode: 'full' };
  } else {
    const y = parseInt(birthYearInput.value.trim(), 10);
    if (!y || isNaN(y)) {
      showResult(`<div class="alert warning">Vui lòng nhập năm sinh hợp lệ.</div>`);
      return null;
    }
    if (y < 1900 || y > CURRENT_YEAR) {
      showResult(`<div class="alert warning">Năm sinh phải từ 1900 đến ${CURRENT_YEAR}.</div>`);
      return null;
    }
    // Chế độ chỉ năm sinh: giả định 01/01 nhưng hiển thị chỉ năm
    return { date: new Date(y, 0, 1), mode: 'year' };
  }
}

// ===== Xử lý tính toán =====
function handleCalculate() {
  const input = getBirthDateFromInput();
  if (!input) return;

  const birthDate = input.date;
  const displayMode = input.mode;
  const today = startOfDay(new Date());
  const currentAge = calcAge(birthDate, today);

  // ===== Timeline =====
  const timelineHtml = MILESTONES.map((m) => {
    const milestoneDate = addYears(birthDate, m.age);
    const windowStartDate = addYears(milestoneDate, -WINDOW_YEARS);
    // Cửa sổ: từ windowStartDate đến milestoneDate (ngày đủ tuổi)

    let status, statusLabel, statusClass;

    if (today >= milestoneDate) {
      status = 'past';
      statusLabel = 'Đã qua';
      statusClass = 'past';
    } else if (today >= windowStartDate) {
      status = 'current';
      statusLabel = 'Đang trong thời điểm';
      statusClass = 'current';
    } else {
      status = 'future';
      statusLabel = 'Chưa tới';
      statusClass = 'future';
    }

    // Hiển thị theo chế độ
    const milestoneDisplay = displayMode === 'full'
      ? formatDate(milestoneDate)
      : `Năm ${milestoneDate.getFullYear()}`;

    const windowDisplay = displayMode === 'full'
      ? `${formatDate(windowStartDate)} – ${formatDate(milestoneDate)}`
      : `Năm ${windowStartDate.getFullYear()} – ${milestoneDate.getFullYear()}`;

    const windowText = `<span class="window">Thời điểm đổi: ${windowDisplay} (tuổi ${m.age - WINDOW_YEARS}–${m.age})</span>`;

    return `
      <div class="timeline-item ${status}">
        <div class="age-badge ${statusClass}">${m.age}</div>
        <div class="info">
          <div class="year">Mốc: ${milestoneDisplay}</div>
          <div class="desc">${m.label}</div>
          ${windowText}
        </div>
        <span class="status-badge ${statusClass}">${statusLabel}</span>
      </div>
    `;
  }).join('');

  // ===== Mốc tiếp theo =====
  const nextMilestone = MILESTONES.find((m) => addYears(birthDate, m.age) > today);

  let alertHtml = '';

  if (!nextMilestone) {
    alertHtml = `
      <div class="alert success">
        ✅ Bạn đã qua tất cả các mốc tuổi bắt buộc đổi CCCD (60 tuổi).
        Thẻ Căn cước của bạn có giá trị sử dụng vĩnh viễn, không cần đổi thêm.
      </div>
    `;
  } else {
    const nextMilestoneDate = addYears(birthDate, nextMilestone.age);
    const nextWindowStart = addYears(nextMilestoneDate, -WINDOW_YEARS);
    const nextIdx = MILESTONES.indexOf(nextMilestone);
    const nextAfter = MILESTONES[nextIdx + 1];
    const validUntil = nextAfter ? nextAfter.age : 60;

    // Hiển thị ngày/tháng theo chế độ
    const nextWindowDisplay = displayMode === 'full'
      ? `${formatDate(nextWindowStart)} – ${formatDate(nextMilestoneDate)}`
      : `Năm ${nextWindowStart.getFullYear()} – ${nextMilestoneDate.getFullYear()}`;

    const inWindow = today >= nextWindowStart && today < nextMilestoneDate;
    const yearsToWindow = nextWindowStart.getFullYear() - today.getFullYear();

    if (inWindow) {
      // Đang trong cửa sổ vàng
      let extraNote = '';
      if (nextMilestone.age === 14) {
        extraNote = ` Nếu làm thẻ trong giai đoạn này, thẻ sẽ có giá trị đến <strong>${validUntil} tuổi</strong> — bạn không cần đổi lại khi vừa đủ 14 tuổi.`;
      }

      alertHtml = `
        <div class="alert warning">
          🔔 <strong>Bạn đang trong thời điểm để đổi thẻ!</strong>
          Mốc tuổi tiếp theo là <strong>${nextMilestone.age} tuổi</strong> — 
          thời điểm đổi thẻ: <strong>${nextWindowDisplay}</strong>.${extraNote}
        </div>
      `;
    } else if (yearsToWindow <= 0) {
      // Đã qua cửa sổ nhưng chưa đủ tuổi (hiếm)
      alertHtml = `
        <div class="alert info">
          📌 Bạn sắp đủ <strong>${nextMilestone.age} tuổi</strong>.
          Thời điểm đổi thẻ là <strong>${nextWindowDisplay}</strong>.
        </div>
      `;
    } else {
      // Chưa tới cửa sổ
      let extraNote = '';
      if (nextMilestone.age === 14) {
        extraNote = ` Nếu làm thẻ trong giai đoạn 12–13 tuổi, thẻ sẽ có giá trị đến <strong>${validUntil} tuổi</strong>.`;
      }

      alertHtml = `
        <div class="alert info">
          📌 Mốc tuổi tiếp theo: <strong>${nextMilestone.age} tuổi</strong>.
          Bạn có thể làm thủ tục đổi thẻ sớm trong thời điểm
          <strong>${nextWindowDisplay}</strong> (còn khoảng <strong>${yearsToWindow} năm</strong> nữa).${extraNote}
        </div>
      `;
    }
  }

  // Thanh tiến trình
  const progressHtml = renderProgressBar(currentAge);

  // Dòng tiêu đề kết quả
  const titleLine = displayMode === 'full'
    ? `🪪 Kết quả cho ngày sinh ${formatDate(birthDate)}`
    : `🪪 Kết quả cho năm sinh ${birthDate.getFullYear()}`;

  const subtitleLine = displayMode === 'full'
    ? `Tuổi hiện tại: <strong>${currentAge} tuổi</strong> (tính đến ${formatDate(today)})`
    : `Tuổi hiện tại (ước tính): <strong>${currentAge} tuổi</strong> • Năm nay: ${CURRENT_YEAR}`;

  showResult(`
    <div class="result-title">${titleLine}</div>
    <div class="result-subtitle">${subtitleLine}</div>
    ${progressHtml}
    <div class="timeline" style="margin-top: 20px;">${timelineHtml}</div>
    ${alertHtml}
    <div class="alert info" style="margin-top: 10px;">
      💡 <strong>Vì sao có thời điểm 2 năm?</strong>
      Quy định cho phép làm thủ tục đổi thẻ trong <strong>2 năm trước</strong> mốc tuổi
      (áp dụng cho cả mốc 14 tuổi) và thẻ vẫn có giá trị đến mốc tiếp theo.
      ${displayMode === 'full'
        ? 'Kết quả trên tính chính xác đến từng ngày dựa trên ngày sinh bạn đã nhập.'
        : 'Bạn có thể chuyển sang chế độ "Biết chính xác ngày sinh" để có kết quả đến từng ngày.'}
    </div>
  `);
}

// ===== Thanh tiến trình =====
function renderProgressBar(currentAge) {
  const MAX_AGE = 60;
  const pct = Math.min((currentAge / MAX_AGE) * 100, 100);

  const markers = MILESTONES.map((m) => {
    const pos = (m.age / MAX_AGE) * 100;
    return `<div class="progress-marker" style="left: ${pos}%;" title="Mốc ${m.age} tuổi"></div>`;
  }).join('');

  return `
    <div class="progress-bar">
      <div class="progress-label">
        <span>0 tuổi</span>
        <span>Hiện tại: <strong>${currentAge} tuổi</strong></span>
        <span>60 tuổi</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${pct}%;"></div>
        ${markers}
      </div>
    </div>
  `;
}

// ===== Hiển thị kết quả =====
function showResult(html) {
  resultCard.innerHTML = html;
  resultSection.classList.remove('hidden');
}