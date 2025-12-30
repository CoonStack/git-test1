const aEl = document.getElementById("a");
const bEl = document.getElementById("b");
const sumEl = document.getElementById("sum");
const btn = document.getElementById("btn");

function toNumber(value) {
  // 빈 값이면 0으로
  if (value === "" || value == null) return 0;
  return Number(value);
}

function calculate() {
  const a = toNumber(aEl.value);
  const b = toNumber(bEl.value);
  sumEl.textContent = a + b;
}

btn.addEventListener("click", calculate);

// 엔터로도 계산되게 (입력창에서 Enter 치면 계산)
[aEl, bEl].forEach((el) => el.addEventListener("keydown", (e) => {
  if (e.key === "Enter") calculate();
}));
// ===== 문의 양식 + 테이블 =====
const API_BASE = "https://git-test1-jtif.onrender.com";

const form = document.getElementById("contactForm");
const nameEl = document.getElementById("contactName");
const emailEl = document.getElementById("contactEmail");
const msgEl = document.getElementById("contactMessage");
const statusEl = document.getElementById("contactStatus");

const tableBody = document.querySelector("#contactTable tbody");

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRows(rows) {
  tableBody.innerHTML = rows
    .map(
      (r) => `
      <tr>
        <td>${r.id}</td>
        <td>${escapeHtml(r.name)}</td>
        <td>${escapeHtml(r.email)}</td>
        <td>${escapeHtml(r.message)}</td>
        <td>${escapeHtml(r.created_at)}</td>
      </tr>
    `
    )
    .join("");
}

async function loadContacts() {
  const res = await fetch(`${API_BASE}/api/contacts`);
  const rows = await res.json();
  renderRows(rows);
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "제출 중...";

  try {
    const payload = {
      name: nameEl.value,
      email: emailEl.value,
      message: msgEl.value,
    };

    const res = await fetch(`${API_BASE}/api/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "제출 실패");
    }

    // 제출 성공 → 입력 초기화 → 목록 갱신
    nameEl.value = "";
    emailEl.value = "";
    msgEl.value = "";
    statusEl.textContent = "제출 완료! 아래 누적 문의에서 확인할 수 있어요.";

    await loadContacts();
  } catch (err) {
    statusEl.textContent = `에러: ${err.message}`;
  }
});

// 페이지 로드 시 기존 문의 불러오기
loadContacts();
