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
const IMAGE_FOLDER = "Picture/";

// 行リスト
const initialList = ["あ", "か", "さ", "た", "な", "は", "ま", "や", "ら", "わ", "他"];

// 漢字 → 読み仮名
const KanjiToInitial = {
  湯: "ゆ",
  除: "じょ",
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

function normalizeForSearch(text) {
  if (!text) return "";

  // 漢字 → 読み
  const yomi = kanjiToYomi(text);

  // ローマ字 → ひらがな
  const hira = romanToHiragana(yomi);

  // 最終正規化
  return normalizeText(hira);
}


function kanjiToYomi(text) {
  if (!text) return "";

  let result = text;

  Object.keys(KanjiToInitial)
    .sort((a, b) => b.length - a.length)
    .forEach(k => {
      result = result.replaceAll(k, KanjiToInitial[k]);
    });

  return result;
}


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
    `;

    // ★ 説明がある場合のみ追加
    if (item.content) {
      const desc = document.createElement("p");
      desc.innerHTML = `説明<br>${convertTextToHtml(item.content)}`;
      body.appendChild(desc);
    }

    card.appendChild(body);
    container.appendChild(card);
  });
}

// ==================== 正規化関数 ====================

function romanToHiragana(input) {
  if (!input) return "";

  let str = input.toLowerCase();

  const table = {
    kya:"きゃ", kyu:"きゅ", kyo:"きょ",
    sha:"しゃ", shu:"しゅ", sho:"しょ",
    cha:"ちゃ", chu:"ちゅ", cho:"ちょ",
    nya:"にゃ", nyu:"にゅ", nyo:"にょ",
    hya:"ひゃ", hyu:"ひゅ", hyo:"ひょ",
    mya:"みゃ", myu:"みゅ", myo:"みょ",
    rya:"りゃ", ryu:"りゅ", ryo:"りょ",
    gya:"ぎゃ", gyu:"ぎゅ", gyo:"ぎょ",
    bya:"びゃ", byu:"びゅ", byo:"びょ",
    pya:"ぴゃ", pyu:"ぴゅ", pyo:"ぴょ",
    ja:"じゃ", ju:"じゅ", jo:"じょ"
  };

  // 3文字ローマ字
  for (const k in table) {
    str = str.replace(new RegExp(k, "g"), table[k]);
  }

  const table2 = {
    a:"あ", i:"い", u:"う", e:"え", o:"お",
    ka:"か", ki:"き", ku:"く", ke:"け", ko:"こ",
    sa:"さ", shi:"し", su:"す", se:"せ", so:"そ",
    ta:"た", chi:"ち", tsu:"つ", te:"て", to:"と",
    na:"な", ni:"に", nu:"ぬ", ne:"ね", no:"の",
    ha:"は", hi:"ひ", fu:"ふ", he:"へ", ho:"ほ",
    ma:"ま", mi:"み", mu:"む", me:"め", mo:"も",
    ya:"や", yu:"ゆ", yo:"よ",
    ra:"ら", ri:"り", ru:"る", re:"れ", ro:"ろ",
    wa:"わ", wo:"を", n:"ん",
    ga:"が", gi:"ぎ", gu:"ぐ", ge:"げ", go:"ご",
    za:"ざ", ji:"じ", zu:"ず", ze:"ぜ", zo:"ぞ",
    da:"だ", di:"ぢ", du:"づ", de:"で", do:"ど",
    ba:"ば", bi:"び", bu:"ぶ", be:"べ", bo:"ぼ",
    pa:"ぱ", pi:"ぴ", pu:"ぷ", pe:"ぺ", po:"ぽ"
  };

  // 2文字 → 1文字
  for (const k in table2) {
    str = str.replace(new RegExp(k, "g"), table2[k]);
  }

  return str;
}

function hiraganaToRoman(input) {
  if (!input) return "";

  const table = {
    あ:"a", い:"i", う:"u", え:"e", お:"o",
    か:"ka", き:"ki", く:"ku", け:"ke", こ:"ko",
    さ:"sa", し:"shi", す:"su", せ:"se", そ:"so",
    た:"ta", ち:"chi", つ:"tsu", て:"te", と:"to",
    な:"na", に:"ni", ぬ:"nu", ね:"ne", の:"no",
    は:"ha", ひ:"hi", ふ:"fu", へ:"he", ほ:"ho",
    ま:"ma", み:"mi", む:"mu", め:"me", も:"mo",
    や:"ya", ゆ:"yu", よ:"yo",
    ら:"ra", り:"ri", る:"ru", れ:"re", ろ:"ro",
    わ:"wa", を:"wo", ん:"n",

    が:"ga", ぎ:"gi", ぐ:"gu", げ:"ge", ご:"go",
    ざ:"za", じ:"ji", ず:"zu", ぜ:"ze", ぞ:"zo",
    だ:"da", ぢ:"ji", づ:"zu", で:"de", ど:"do",
    ば:"ba", び:"bi", ぶ:"bu", べ:"be", ぼ:"bo",
    ぱ:"pa", ぴ:"pi", ぷ:"pu", ぺ:"pe", ぽ:"po",

    きゃ:"kya", きゅ:"kyu", きょ:"kyo",
    しゃ:"sha", しゅ:"shu", しょ:"sho",
    ちゃ:"cha", ちゅ:"chu", ちょ:"cho",
    にゃ:"nya", にゅ:"nyu", にょ:"nyo",
    ひゃ:"hya", ひゅ:"hyu", ひょ:"hyo",
    みゃ:"mya", みゅ:"myu", みょ:"myo",
    りゃ:"rya", りゅ:"ryu", りょ:"ryo",
    ぎゃ:"gya", ぎゅ:"gyu", ぎょ:"gyo",
    じゃ:"ja", じゅ:"ju", じょ:"jo"
  };

  let str = input;

  // 拗音（2文字）を先に処理
  Object.keys(table)
    .filter(k => k.length === 2)
    .forEach(k => {
      str = str.replace(new RegExp(k, "g"), table[k]);
    });

  // 1文字ずつ変換
  return str.replace(/./g, ch => table[ch] || ch);
}

function normalizeText(text) {
  if (!text) return "";

  // 1. 全角→半角
  text = text.normalize("NFKC");

  // 2. カタカナ → ひらがな
  text = text.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );

  // 3. 濁点除去
  text = text.normalize("NFKD").replace(/[\u3099\u309A]/g, "");

  // ⭐ 追加：長音・記号・空白を除去
  text = text.replace(/[ー－‐-–—~〜\s]/g, "");

  // 4. 小文字化
  return text.toLowerCase();
}


function stripLeadingAlphabet(text) {
  if (!text) return "";

  // 全角→半角に正規化
  text = text.normalize("NFKC");

  // 先頭の英字を除去
  return text.replace(/^[a-zA-Z]+/, "");
}


function saveSearchHistory(word) {
  if (!word) return;

  let history = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  // 重複除去
  history = history.filter(w => w !== word);

  history.unshift(word); // 先頭に追加

  if (history.length > 10) history.pop();

  localStorage.setItem("searchHistory", JSON.stringify(history));
}


function searchItems() {
  const searchBox = document.getElementById("searchBox");
  const raw = searchBox?.value.trim();

  if (!raw) {
    isSearching = false;
    searchResults = [];
    applyFiltersAndRender();
    updatePagingButtons();
    return;
  }

  isSearching = true;

  // ★ ここが最大のポイント
  const queryNorm = normalizeForSearch(raw);

  searchResults = allItems.filter(item => {
    if (item.isLabel) return false;

    const titleNorm = normalizeForSearch(item.title);

    return titleNorm.includes(queryNorm);
  });

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
    `;

    // ★ 説明がある場合のみ追加
    if (item.content) {
      const desc = document.createElement("p");
      desc.innerHTML = `説明<br>${convertTextToHtml(item.content)}`;
      body.appendChild(desc);
    }
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




function showSearchHistory() {
  const box = document.getElementById("searchHistoryDropdown");
  if (!box) return;

  const history = JSON.parse(localStorage.getItem("searchHistory") || "[]");

  if (history.length === 0) {
    box.style.display = "none";
    return;
  }

  box.innerHTML = "";
  history.slice(0, 5).forEach(word => {
    const div = document.createElement("div");
    div.textContent = word;
    div.onclick = () => {
      document.getElementById("searchBox").value = word;
      box.style.display = "none";
      searchItems();
    };
    box.appendChild(div);
  });

  box.style.display = "block";
}

function handleSearchButton() {
  const searchBox = document.getElementById("searchBox");
  const value = searchBox.value.trim();
  if (!value) return;

  saveSearchHistory(value);  // ★ ボタン押下時のみ保存
  searchItems();
}



function hideSearchHistory() {
  const box = document.getElementById("searchHistoryDropdown");
  if (!box) return;
  box.style.display = "none";
}



window.onload = function() {
  loadItemsFromSheet();

  currentInitialIndex = 0;           // 「あ」行で開始
  currentInitialFilter = initialList[0]; // 「あ」


  const searchBox = document.getElementById("searchBox");

  let isEnterSearch = false;

  // Enterキーでの検索（従来どおり）
  // ✅ keydown（確実に動く）
  searchBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = searchBox.value.trim();
      if (!value) return;

      isEnterSearch = true;        // ★ Enter検索開始
      saveSearchHistory(value);   // ★ 履歴保存
      searchItems();              // ★ 検索実行

      // inputイベントとの二重発火防止
      setTimeout(() => {
        isEnterSearch = false;
      }, 0);
    }
  });




  searchBox.addEventListener("focus", showSearchHistory);

  searchBox.addEventListener("input", showSearchHistory);

  searchBox.addEventListener("blur", () => {
    setTimeout(hideSearchHistory, 150);
  });


  // 入力時に自動検索
  searchBox.addEventListener("input", function() {
    if (isEnterSearch) return; // ★ これがないとEnter2回問題が出る
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
