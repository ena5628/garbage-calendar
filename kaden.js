// ==================== グローバル変数 ====================

let allItems = [];
let currentItems = [];
let currentInitialIndex = 0;
let currentInitialFilter = null;
let initialGroups = {};
let isSearching = false;       // 検索中フラグ
let searchResults = [];        // 検索結果保持用

// Googleスプレッドシート CSV
const sheetCsvUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcgcKTLcJOUEmZQ4VYFueERLuygVMLE38lJBCnIRAezueNu2PmlXeYhGzd0lxeBvFvwRVEvtiYGTxt/pub?output=csv";

// 画像フォルダ
const IMAGE_FOLDER = "画像一覧/";

// 行リスト
const initialList = ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "他"];

// 漢字 → 読み仮名
const KanjiToInitial = {
  湯: "ゆ",
  電: "で",
  金: "きん",
  紙: "かみ",
  衣: "い",
  植: "しょく",
  水: "みず",
  石: "いし",
  乾: "かん",
  鉛: "えん",
  木: "もく",
  缶: "かん",
  瓶: "びん",
};

// ==================== イニシャル判定 ====================

function getInitial(char) {
  if (!char) return "他";

  let c = char.charAt(0);

  if (KanjiToInitial[c]) c = KanjiToInitial[c].charAt(0);

  if (/^[A-Z]/i.test(c)) {
    const m = c.toUpperCase();
    if ("AEIOU".includes(m)) return "あ";
    if ("K".includes(m)) return "か";
    if ("S".includes(m)) return "さ";
    if ("TD".includes(m)) return "た";
    if ("N".includes(m)) return "な";
    if ("HBP".includes(m)) return "は";
    if ("M".includes(m)) return "ま";
    if ("Y".includes(m)) return "や";
    if ("R".includes(m)) return "ら";
    if ("W".includes(m)) return "わ";
    return "他";
  }

  if (/^[ァ-ヶ]/.test(c)) {
    c = String.fromCharCode(c.charCodeAt(0) - 0x60);
  }

  c = c.normalize("NFKD").replace(/[\u3099\u309A]/g, "");

  if ("あいうえおぁぃぅぇぉ".includes(c)) return "あ";
  if ("かきくけこがぎぐげご".includes(c)) return "か";
  if ("さしすせそざじずぜぞ".includes(c)) return "さ";
  if ("たちつてとだぢづでどっ".includes(c)) return "た";
  if ("なにぬねの".includes(c)) return "な";
  if ("はひふへほばびぶべぼぱぴぷぺぽ".includes(c)) return "は";
  if ("まみむめも".includes(c)) return "ま";
  if ("やゆよゃゅょ".includes(c)) return "や";
  if ("らりるれろ".includes(c)) return "ら";
  if ("わをん".includes(c)) return "わ";

  return "他";
}

// ==================== データ取得 ====================

async function loadItemsFromSheet() {
  try {
    const res = await fetch(sheetCsvUrl);
    const csv = await res.text();
    const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });

    allItems = parsed.data
      .map((r) => {
        const title = r.Garbage_title?.trim() || "";
        const kind = r.Garbage_kind?.trim() || "";
        const content = r.Garbage_contents?.trim() || "";
        const img = r.Garbage_gazou?.trim() || "";

        const isLabel =
          title.length === 1 &&
          initialList.includes(title) &&
          !kind &&
          !content &&
          !img;

        return { title, kind, content, img, isLabel };
      })
      .filter((item) => item.title);

    buildInitialGroups();

    currentInitialIndex = 0;
    currentInitialFilter = initialList[0];

    renderInitialButtons();
    applyFiltersAndRender();

  } catch (e) {
    console.error("データ取得失敗", e);
    document.getElementById("itemsContainer").innerHTML =
      "<p>データの読み込みに失敗しました</p>";
  }
}

// ==================== 行グループ生成 ====================

function buildInitialGroups() {
  initialGroups = {};
  initialList.forEach(i => (initialGroups[i] = []));

  let currentGroup = null;

  allItems.forEach(item => {
    if (item.isLabel) {
      currentGroup = item.title;
      initialGroups[currentGroup].push(item);
      return;
    }

    if (currentGroup) {
      initialGroups[currentGroup].push(item);
    }
  });
}

// ==================== 説明文内リンク変換 ====================

function convertTextToHtml(text) {
  if (!text) return "";
  return text
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
    .replace(/\n/g, "<br>");
}

// ==================== イニシャルボタン ====================

function renderInitialButtons() {
  const box = document.getElementById("initialButtonsContainer");
  if (!box) return;

  box.innerHTML = "";

  initialList.forEach((i) => {
    if (i === "他") return; // ← 「他」のボタンは生成しない
    const btn = document.createElement("button");
    btn.className = "initialButton";
    btn.textContent = i;
    btn.onclick = () => handleInitialFilter(i);
    if (i === currentInitialFilter) btn.classList.add("active");
    box.appendChild(btn);
  });
}

function handleInitialFilter(initial) {
  currentInitialFilter = initial;
  currentInitialIndex = initialList.indexOf(initial);
  renderInitialButtons();

  // 検索中フラグを解除
  if (isSearching) {
    isSearching = false;
    searchResults = [];

    // 検索ボックスを空にする
    const searchBox = document.getElementById("searchBox");
    if (searchBox) searchBox.value = "";
  }

  applyFiltersAndRender();
}

// ==================== フィルタ & 描画 ====================

function applyFiltersAndRender() {
  if (isSearching) {
    renderSearchResults();
    return;
  }
  currentItems = initialGroups[currentInitialFilter] || [];
  renderItems();
}

function renderItems() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (currentItems.length === 0) {
    container.innerHTML = "<p>該当する品目はありません</p>";
    return;
  }

  currentItems.forEach((item) => {

    if (item.isLabel) {
      const label = document.createElement("div");
      label.className = "initialLabel";
      label.textContent = item.title + "行";
      container.appendChild(label);
      return;
    }

    const card = document.createElement("div");
    card.className = "itemCard";

    if (item.img) {
      const img = document.createElement("img");
      img.src = IMAGE_FOLDER + item.img;
      card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "itemCard-content";
    body.innerHTML = `
      <h3>${item.title}</h3>
      <p>種類: ${item.kind}</p>
      <p>説明<br>${convertTextToHtml(item.content)}</p>
    `;
    card.appendChild(body);
    container.appendChild(card);
  });
}

// ==================== 正規化関数 ====================
function normalizeText(text) {
  if (!text) return "";

  // 1. 全角→半角、NFKC正規化
  text = text.normalize("NFKC");

  // 2. カタカナをひらがなに統一
  text = text.replace(/[\u30A1-\u30F6]/g, function(ch) {
    return String.fromCharCode(ch.charCodeAt(0) - 0x60);
  });

  // 3. 濁音・半濁音を分解（ガ -> か + ゛）
  text = text.normalize("NFKD").replace(/[\u3099\u309A]/g, "");

  // 4. 小文字化
  return text.toLowerCase();
}

// ==================== 検索 ====================
function searchItems() {
  const searchBox = document.getElementById("searchBox");
  const query = normalizeText(searchBox?.value.trim());
  
  if (!query) {
    isSearching = false;
    searchResults = [];
    applyFiltersAndRender();
    updatePagingButtons();
    return;
  }

  isSearching = true;
  // 正規化したタイトルで検索
  searchResults = allItems.filter(item =>
    normalizeText(item.title).includes(query)
  );
  renderSearchResults();
  updatePagingButtons();
}


function renderSearchResults() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (searchResults.length === 0) {
    container.innerHTML = "<p>該当する品目はありません</p>";
    return;
  }

  searchResults.forEach(item => {
    if (item.isLabel) {
      const label = document.createElement("div");
      label.className = "initialLabel";
      label.textContent = item.title + "行";
      container.appendChild(label);
      return;
    }

    const card = document.createElement("div");
    card.className = "itemCard";

    if (item.img) {
      const img = document.createElement("img");
      img.src = IMAGE_FOLDER + item.img;
      card.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "itemCard-content";
    body.innerHTML = `
      <h3>${item.title}</h3>
      <p>種類: ${item.kind}</p>
      <p>説明<br>${convertTextToHtml(item.content)}</p>
    `;
    card.appendChild(body);
    container.appendChild(card);
  });
}

// ==================== ページ送り ====================

function updatePagingButtons() {
  const prevBtn = document.querySelector("#paging button:nth-child(1)");
  const nextBtn = document.querySelector("#paging button:nth-child(2)");

  if (isSearching) {
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    prevBtn.style.backgroundColor = "#ccc";
    nextBtn.style.backgroundColor = "#ccc";
    prevBtn.style.cursor = "not-allowed";
    nextBtn.style.cursor = "not-allowed";
  } else {
    prevBtn.disabled = currentInitialIndex === 0;
    nextBtn.disabled = currentInitialIndex === initialList.length - 2;

    prevBtn.style.backgroundColor = "";
    nextBtn.style.backgroundColor = "";
    prevBtn.style.cursor = "pointer";
    nextBtn.style.cursor = "pointer";
  }
}

function nextPage() {
  if (isSearching) return;
  if (currentInitialIndex < initialList.length - 2) {
    currentInitialIndex++;
    currentInitialFilter = initialList[currentInitialIndex];
    renderInitialButtons();
    applyFiltersAndRender();
    window.scrollTo(0, 0);
  }
  updatePagingButtons();
}

function prevPage() {
  if (isSearching) return;
  if (currentInitialIndex > 0) {
    currentInitialIndex--;
    currentInitialFilter = initialList[currentInitialIndex];
    renderInitialButtons();
    applyFiltersAndRender();
    window.scrollTo(0, 0);
  }
  updatePagingButtons();
}

// 検索やイニシャルボタン押下時にも呼ぶ
function handleInitialFilter(initial) {
  currentInitialFilter = initial;
  currentInitialIndex = initialList.indexOf(initial);
  renderInitialButtons();

  if (isSearching) {
    isSearching = false;
    searchResults = [];
    const searchBox = document.getElementById("searchBox");
    if (searchBox) searchBox.value = "";
  }

  applyFiltersAndRender();
  updatePagingButtons();
}

window.onload = function() {
  loadItemsFromSheet();

  currentInitialIndex = 0;           // 「あ」行で開始
  currentInitialFilter = initialList[0]; // 「あ」


  const searchBox = document.getElementById("searchBox");

  // Enterキーでの検索（従来どおり）
  searchBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") searchItems();
  });

  // 入力時に自動検索
  searchBox.addEventListener("input", function() {
    const query = searchBox.value.trim();
    if (query) {
      searchItems();  // 入力値に応じてリアルタイム検索
    } else {
      // 入力が空になったら検索解除
      isSearching = false;
      searchResults = [];
      applyFiltersAndRender();
      updatePagingButtons();
    }
  });

  // ページングボタン初期化
  updatePagingButtons();
};
