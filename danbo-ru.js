// ================================
// 町名・丁目リスト
// ================================
const nakayamateList = ["1丁目","2丁目","3丁目","4丁目","5丁目","6丁目","7丁目","8丁目"];
const ninomiyaList = ["1丁目","2丁目","3丁目","4丁目"];
const kanouList = ["1丁目","2丁目","3丁目","4丁目","5丁目","6丁目"];
const kitanoList = ["1丁目","2丁目","3丁目","4丁目"];
const nunobikiList = ["1丁目","2丁目","3丁目","4丁目"];
const kotonoList = ["1丁目","2丁目","3丁目","4丁目","5丁目"];

// 町名 → 丁目マップ
const chomeMap = {
  "中山手通": nakayamateList,
  "二宮町": ninomiyaList,
  "加納町": kanouList,
  "北野町": kitanoList,
  "布引町": nunobikiList,
  "琴ノ緒町": kotonoList
};

// ページング用
const PAGE_SIZE = 4;
let structuredData = [];
let currentResults = [];
let currentPage = 1;

// DOM
const townSelect = document.getElementById("townSelect");
const chomeSelect = document.getElementById("chomeSelect");
const resultContainer = document.getElementById("resultContainer");

// ================================
// ページロード時に保存状態復元
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const savedTown = sessionStorage.getItem("selectedTown") || "";
  const savedChome = sessionStorage.getItem("selectedChome") || "";

  /*if (savedTown) {
    townSelect.value = savedTown;
    updateChomeSelect(savedTown, savedChome);
  }

  if (savedChome) chomeSelect.value = savedChome;*/

  runSearch(); // 初期表示
});

// ================================
// 丁目セレクト更新
// ================================
function updateChomeSelect(townName, preselectChome = "") {
  chomeSelect.innerHTML = `<option value="">すべての丁</option>`; // 「すべて」を追加
  chomeSelect.disabled = true;

  const list = chomeMap[townName];
  if (!list) return;

  list.forEach(chome => {
    const option = document.createElement("option");
    option.value = chome;
    option.textContent = chome;
    chomeSelect.appendChild(option);
  });

  chomeSelect.disabled = false;

  if (preselectChome && list.includes(preselectChome)) {
    chomeSelect.value = preselectChome;
  }
}

// ================================
// 選択変更時イベント（自動検索）
// ================================
townSelect.addEventListener("change", () => {
  updateChomeSelect(townSelect.value);
  runSearch();
  saveSelection();
});

chomeSelect.addEventListener("change", () => {
  runSearch();
  saveSelection();
});

// ================================
// 選択状態保存
// ================================
function saveSelection() {
  sessionStorage.setItem("selectedTown", townSelect.value);
  sessionStorage.setItem("selectedChome", chomeSelect.value);
}

// ================================
// CSV読み込み・正規化
// ================================
const CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTY5tyWsPDkUb_dqh6eddNVRsxgnQU32oIeoWzrUhxDZPu5pKqPhfK9HL2iXbiES22JuHRNqjXNE0_Q/pub?output=csv";
const TITLE_ORDER = ["対象地域", "日時", "場所", "品目", "業者"];

fetch(CSV_URL)
  .then(res => res.text())
  .then(text => {
    const rows = parseCSV(text);
    structuredData = normalizeRows(rows);
    runSearch(); // 初期表示
  });

// CSVパース
function parseCSV(text) {
  const delimiter = text.includes("\t") ? "\t" : ",";
  const lines = text.replace(/\r/g, "").split("\n");
  const headers = lines.shift().split(delimiter).map(h => h.trim());
  const rows = [];

  let buffer = "", quoteCount = 0;
  lines.forEach(line => {
    buffer += (buffer ? "\n" : "") + line;
    quoteCount += (line.match(/"/g) || []).length;

    if (quoteCount % 2 === 0) {
      const values = buffer.split(delimiter);
      const obj = {};
      headers.forEach((h, i) => obj[h] = (values[i] || "").trim());
      rows.push(obj);
      buffer = "";
      quoteCount = 0;
    }
  });
  return rows;
}

// セル整形
function formatCell(text) {
  return text.replace(/^"+|"+$/g, "").replace(/\n/g, "<br><br>");
}

// 正規化
function normalize(str) {
  return str.toLowerCase().replace(/\s|　/g, "");
}

// 行正規化
function normalizeRows(rows) {
  let currentTown = "", currentGroup = "";
  const map = new Map();

  rows.forEach(row => {
    if (row.Town) {
      currentTown = row.Town.trim();
      currentGroup = "";
    }
    if (!currentTown) return;

    if (row.Group_home) currentGroup = row.Group_home.trim();
    if (!map.has(currentTown)) {
      map.set(currentTown, { town: currentTown, key: normalize(currentTown), normal: {}, group: {} });
    }

    const entry = map.get(currentTown);
    if (!row.Title || !row.Content) return;
    const content = formatCell(row.Content);

    if (!currentGroup) {
      entry.normal[row.Title] ??= [];
      entry.normal[row.Title].push(content);
    } else {
      entry.group[currentGroup] ??= {};
      entry.group[currentGroup][row.Title] ??= [];
      entry.group[currentGroup][row.Title].push(content);
    }
  });

  return [...map.values()];
}

// ================================
// 検索処理（町名または丁目未選択ならメッセージ表示）
// ================================
function runSearch() {
  const townKey = normalize(townSelect.value);
  const chome = chomeSelect.value;
  resultContainer.innerHTML = "";

  if (!townKey) {
    showMessage("地域を選択してください。");
    return;
  }

  let results = structuredData.filter(d => d.key.includes(townKey));

  // 「すべての丁目」の場合はフィルタせず、それ以外なら選択された丁目でフィルタ
  if (chome) {
    results = results.filter(d => chome === "" || JSON.stringify(d).includes(chome));
  }

  if (results.length === 0) {
    showMessage("該当する情報が見つかりません。");
    return;
  }

  currentResults = results;
  currentPage = 1;
  renderPage();
}

// ページ描画
function renderPage() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const pageItems = currentResults.slice(start, end);

  resultContainer.innerHTML = "";
  pageItems.forEach(item => {
    const block = document.createElement("div");
    block.className = "townResult";

    let html = `<h3 class="townTitle">${item.town}</h3>`;

    if (Object.keys(item.normal).length) {
      html += `<div class="houseSection"><h4>戸建て</h4>`;
      TITLE_ORDER.forEach(t => {
        item.normal[t]?.forEach(c => html += `<p><strong>${t}：</strong>${c}</p>`);
      });
      html += `</div>`;
    }

    Object.entries(item.group).forEach(([name, data]) => {
      html += `<div class="apartmentSection"><h4>${name}</h4>`;
      TITLE_ORDER.forEach(t => {
        data[t]?.forEach(c => html += `<p><strong>${t}：</strong>${c}</p>`);
      });
      html += `</div>`;
    });

    block.innerHTML = html;
    resultContainer.appendChild(block);
  });

  renderPager();
}

// ページャー
function renderPager() {
  const totalPages = Math.ceil(currentResults.length / PAGE_SIZE);
  if (totalPages <= 1) return;

  const pager = document.createElement("div");
  pager.style.textAlign = "center";
  pager.style.marginTop = "20px";

  const prev = document.createElement("button");
  prev.textContent = "◀ 前へ";
  prev.disabled = currentPage === 1;
  prev.onclick = () => { currentPage--; renderPage(); scrollToResult(); };

  const next = document.createElement("button");
  next.textContent = "次へ ▶";
  next.disabled = currentPage === totalPages;
  next.onclick = () => { currentPage++; renderPage(); scrollToResult(); };

  const info = document.createElement("span");
  info.textContent = ` ${currentPage} / ${totalPages} `;
  info.style.margin = "0 12px";

  pager.appendChild(prev);
  pager.appendChild(info);
  pager.appendChild(next);
  resultContainer.appendChild(pager);
}

// スクロール
function scrollToResult() {
  const resultArea = document.getElementById("resultArea");
  if (!resultArea) return;
  resultArea.scrollIntoView({ behavior: "smooth", block: "start" });
}

// メッセージ表示
function showMessage(msg) {
  resultContainer.innerHTML = `<p>${msg}</p>`;
}
