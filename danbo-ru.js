// ================================
// 町名・丁目リスト
// ================================
const nakayamateList = ["1丁目","2丁目","3丁目","4丁目","5丁目","6丁目","7丁目","8丁目"];
const ninomiyaList   = ["1丁目","2丁目","3丁目","4丁目"];
const kanouList      = ["1丁目","2丁目","3丁目","4丁目","5丁目","6丁目"];
const kitanoList     = ["1丁目","2丁目","3丁目","4丁目"];
const nunobikiList   = ["1丁目","2丁目","3丁目","4丁目"];
const kotonoList     = ["1丁目","2丁目","3丁目","4丁目","5丁目"];

// 町名 → 丁目マップ
const chomeMap = {
  "中山手通": nakayamateList,
  "二宮町": ninomiyaList,
  "加納町": kanouList,
  "北野町": kitanoList,
  "布引町": nunobikiList,
  "琴ノ緒町": kotonoList
};

// ================================
// 🔹 このページ専用 sessionStorage KEY
// ================================
const STORAGE_TOWN  = "special_selectedTown";
const STORAGE_CHOME = "special_selectedChome";

// ================================
// ページング
// ================================
const PAGE_SIZE = 4;
let structuredData = [];
let currentResults = [];
let currentPage = 1;

// ================================
// DOM
// ================================
const townSelect  = document.getElementById("townSelect");
const chomeSelect = document.getElementById("chomeSelect");
const resultContainer = document.getElementById("resultContainer");

// ================================
// ページロード時（保存状態復元）
// ================================
document.addEventListener("DOMContentLoaded", () => {
  const savedTown  = sessionStorage.getItem(STORAGE_TOWN) || "";
  const savedChome = sessionStorage.getItem(STORAGE_CHOME) || "";

  if (savedTown) {
    townSelect.value = savedTown;
    updateChomeSelect(savedTown, savedChome);
  }

  if (savedChome) {
    chomeSelect.value = savedChome;
  }

  runSearch();
});

// ================================
// 丁目セレクト更新
// ================================
function updateChomeSelect(townName, preselectChome = "") {
  chomeSelect.innerHTML = `<option value="">すべての丁</option>`;
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
// 選択変更（自動検索）
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
// 🔹 選択状態保存（完全分離）
// ================================
function saveSelection() {
  sessionStorage.setItem(STORAGE_TOWN, townSelect.value);
  sessionStorage.setItem(STORAGE_CHOME, chomeSelect.value);
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
    runSearch();
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

function formatCell(text) {
  return text.replace(/^"+|"+$/g, "").replace(/\n/g, "<br><br>");
}

function normalize(str) {
  return str.toLowerCase().replace(/\s|　/g, "");
}

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
// 検索処理
// ================================
function runSearch() {
  const selectedTown  = townSelect.value.trim();
  const selectedChome = chomeSelect.value.trim(); // "" の場合は「すべての丁」
  resultContainer.innerHTML = "";

  if (!selectedTown) {
    showMessage("地域を選択してください。");
    return;
  }

  let results = structuredData.filter(d => {
    // データの town 列と、選択された町＋丁目を比較
    const fullKey = selectedChome ? `${selectedTown} ${selectedChome}` : selectedTown;
    return d.town === fullKey;
  });

  // 丁目が「すべての丁」の場合は町名だけで絞り込む
  if (!selectedChome) {
    results = structuredData.filter(d => d.town.startsWith(selectedTown));
  }

  if (!results.length) {
    showMessage("該当する情報が見つかりません。");
    return;
  }

  currentResults = results;
  currentPage = 1;
  renderPage();
}


// ================================
// ページ描画
// ================================
function renderPage() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageItems = currentResults.slice(start, start + PAGE_SIZE);

  resultContainer.innerHTML = "";
  pageItems.forEach(item => {
    const block = document.createElement("div");
    block.className = "townResult";

    let html = `<h3 class="townTitle">${item.town}</h3>`;

    if (Object.keys(item.normal).length) {
      html += `<div class="houseSection"><h4>戸建て</h4>`;

      // normal を「対象地域ごと」にまとめる
      const targetRegions = item.normal["対象地域"] || [];
      targetRegions.forEach((region, index) => {
        // 2つ目以降は上に線を引く
        const borderStyle = index > 0 ? "border-top:1px solid #ccc; padding-top:8px;" : "";
        html += `<div class="targetBlock">`;
        
        // 対象地域
        html += `<p><strong>対象地域：</strong>${region}</p>`;

        // 他の列も同じインデックスで表示
        TITLE_ORDER.forEach(title => {
          if (title === "対象地域") return; // もう出してるのでスキップ
          const col = item.normal[title];
          if (col && col[index]) {
            html += `<p><strong>${title}：</strong>${col[index]}</p>`;
          }
        });

        html += `</div>`; // targetBlock終了
      });

      html += `</div>`; // houseSection終了
    }


    Object.entries(item.group).forEach(([groupName, data]) => {
      html += `<div class="apartmentSection"><h4>${groupName}</h4>`;

      // 対象地域ごとのループ
      const targetRegions = data["対象地域"] || [];
      targetRegions.forEach((region, index) => {
        // 2つ目以降は上に線を引く
        const borderStyle = index > 0 ? "border-top:1px solid #ccc; padding-top:8px;" : "";
        html += `<div class="targetBlock">`;

        // 対象地域
        html += `<p><strong>対象地域：</strong>${region}</p>`;

        // 他の列も同じインデックスで表示
        TITLE_ORDER.forEach(title => {
          if (title === "対象地域") return; // もう出しているのでスキップ
          const col = data[title];
          if (col && col[index]) {
            html += `<p><strong>${title}：</strong>${col[index]}</p>`;
          }
        });

        html += `</div>`; // targetBlock終了
      });

      html += `</div>`; // apartmentSection終了
    });


    block.innerHTML = html;
    resultContainer.appendChild(block);
  });

  renderPager();
}

// ================================
// ページャー
// ================================
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

  pager.append(prev, ` ${currentPage} / ${totalPages} `, next);
  resultContainer.appendChild(pager);
}

function scrollToResult() {
  document.getElementById("resultArea")?.scrollIntoView({ behavior: "smooth" });
}

function showMessage(msg) {
  resultContainer.innerHTML = `<p>${msg}</p>`;
}


// ダークモード切替ボタン
document.addEventListener('DOMContentLoaded', () => {
    const darkToggleBtn = document.getElementById('darkModeToggle');
    if (!darkToggleBtn) return; // 念のためチェック

    // ボタンクリックで切替
    darkToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');

        if(document.body.classList.contains('dark-mode')){
            darkToggleBtn.textContent = 'ライトモード';
        } else {
            darkToggleBtn.textContent = 'ダークモード';
        }

        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
    });

    // ページロード時に前回の設定を反映
    if(localStorage.getItem('darkMode') === 'true'){
        document.body.classList.add('dark-mode');
        darkToggleBtn.textContent = 'ライトモード';
    }
});
