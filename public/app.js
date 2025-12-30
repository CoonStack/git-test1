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
