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
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs1Zbj7FUpACpnArctI5kRf70CvsB89lpds2A3FxaDPDLdVCt2Kl5QZ8TRWaQqg3ff9SL1kOZd18zo/pub?output=csv";

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
  卓上調理器: "たく",
  衣類乾燥機: "いるいかんそうき",
  腕時計: "うでどけい",
  編: "あ",
  懐中電灯: "かいちゅうでんとう",
  延長: "えんちょう",
  時計: "とけい",
  機器: "きき",
  温水洗浄機付便座: "おんしょうせんじょうきつきべんざ",
  温度計:"おんどけい",
  加湿器: "かしつき",
  加熱式: "かねつき",
  換気扇: "かんきせん",
  楽器: "がっき",
  空気清浄機: "くうきせいじょうき",
  蛍光灯・蛍光管: "けいこうとう",
  携帯型扇風機: "けいたいがたせんぷうき",
  携帯型: "けいたがた",
  携帯電話: "けいたいでんわ",
  血圧計: "けつあつけい",
  天板: "てんばん",
  布団: "ふとん",
  機: "き",
  自動: "じどう",
  充電式掃除機: "じゅうでんそうじき",
  充電式電池: "じゅうでんしきでんち",
  浄水器: "じょうすいき",
  照明器具: "しょうめいきぐ",
  除湿機: "じょしつき",
  乾燥機: "かんそうき",
  炊飯器: "すいはんき",
  洗濯機: "せんたくき",
  扇風機: "せんぷうき",
  掃除機: "そうじき",
  体温計: "たいおんけい",
  端末: "たんまつ",
  電気: "でんき",
  電気: "でんき",
  電子辞書: "でんしじしょ",
  電卓: "でんたく",
  電動歯: "でんどうは",
  電動工具: "でんどうこうぐ",
  電話機: "でんわき",
  用: "よう",
  指定袋: "していぶくろ",
  型: "かた",
  目覚: "めざ",
  餅: "もち",
  湯沸: "ゆわ",
  冷蔵庫: "れいぞうこ",
  冷凍庫: "れいとうこ",
  冷風機: "れいふうき",
  庫: "こ",
  木製: "もくせい",
  金属製: "きんぞくせい",
  電池: "でんち",
  台: "だい",
  輸液: "けつゆ",
  在宅医療用品: "ざいたくいりょうひん",
  製品: "せいひん",
  板: "いた",
  魔法瓶: "まほうびん",
  虫: "むし",
  眼鏡: "めがね",
  物干: "ものほ",
  灰皿: "はいざら",
  小型充電式電池: "こがたじゅうでんしきでんち",
  自動車: "じどうしゃ",
  電動自転車: "でんどうじてんしゃよう",
  発電機: "はつでんき",
  発泡: "はっぽう",
  花: "はな",
  花火: "はなび",
  針: "はり",
  針金: "はりがね",
  木製: "もくせい",
  屏風: "びょうぶ",
  肥料: "ひりょう",
  封筒: "ふうとう",
  陶器製: "とうきせい",
  乾燥機: "かんそうき",
  布団干: "ふとんほ",
  健康器: "けんこうき",
  下: "さ",
  金属製以外: "きんぞくせいいがい",
  家庭用: "かていよう",
  容器: "ようき",
  含: "ふく",
  古着: "ふるぎ",
  衣服: "いふく",
  古布: "こふ",
  風呂: "ふろ",
  文鎮: "ぶんちん",
  指定袋: "していぶくろ",
  専用砂: "せんようすな",
  缶: "かん",
  飲料: "いんりょう",
  体重計: "たいじゅうけい",
  弁当: "べんとう",
  紙製: "かみせい",
  捨: "す",
  金属製: "きんぞくせい",
  防球: "ぼうきゅう",
  防鳥: "ぼうちょう",
  芳香剤: "ほうこうざい",
  帽子: "ぼうし",
  包装: "ほうそう",
  包帯: "ほうたい",
  在宅医療用品: "ざいたくいりょうようひん",
  防虫剤: "ぼうちゅうざい",
  包丁: "ほうちょう",
  球: "たま",
  電源: "でんげん",
  歩行器: "ほこうき",
  乳瓶: "にゅうびん",
  袋: "ぶくろ",
  保冷剤: "ほれいざい",
  保冷枕: "ほれいまくら",
  本: "ほん",
  本棚: "ほんだな",
  納豆: "なっとう",
  鍋: "なべ",
  電池: "でんち",
  水素: "すいそ",
  野菜: "やさい",
  果物: "くだもの",
  紙粘土: "かみねんど",
  小麦粘土: "こむぎねんど",
  石粉製: "せきふんせい",
  農薬: "のうやく",
  粘土: "ねんど",
  農薬: "のうやく",
  海苔: "のり",
  佃煮: "つくだに",
  台: "だい",
  指定袋: "していぶくろ",
  以下: "いか",
  金属製: "きんぞくせい",
  石: "いし",
  少量: "しょうりょう",
  一輪車: "いちりんしゃ",
  運搬用: "うんぱんよう",
  犬小屋: "いぬごや",
  入: "い",
  歯: "は",
  金属部品: "きんぞくぶひん",
  缶: "かん",
  大: "おお",
  時計: "とけい",
  柱時計: "はしらどけい",
  機器: "きき",
  単車: "たんしゃ",
  斧: "おの",
  用: "よう",
  在宅医療用品: "ざいたくいりょうようひん",
  乾電池: "かんでんち",
  楽器: "がっき",
  吸引用: "きゅういんよう",
  草刈: "くさか",
  機: "き",
  蛍光灯: "けいこうとう",
  蛍光管: "けいこうかん",
  環型: "かんがた",
  直管型: "ちょっかんがた",
  電球型: "でんきゅうがた",
  型: "がた",
  珪藻土: "けいそうど",
  劇薬: "げきやく",
  塩酸: "えんさん",
  苛性: "かせい",
  血圧計: "けつあつけい",
  水銀: "すいぎん",
  原動機付自転車: "げんどうきつきじてんしゃ",
  電池: "でんち",
  三輪車: "さんりんしゃ",
  磁石: "じしゃく",
  自転車: "じてんしゃ",
  消火器: "しょうかき",
  人工芝: "じんこうしば",
  類: "るい",
  水槽: "すいそう",
  製: "せい",
  袋: "ぶくろ",
  整髪: "せいはつ",
  体温計: "たいおんけい",
  耐火金庫: "たいかきんこ",
  台車: "だいしゃ",
  車: "くるま",
  卓上: "たくじょう",
  畳: "たたみ",
  脱酸素剤: "だつさんそざい",
  食品: "しょくひん",
  鮮度保持剤: "せんどほじざい",
  脱臭剤: "だっしゅうざい",
  容器: "ようき",
  食品保存容器: "しょくひんほぞんようき",
  建具: "たてぐ",
  障子: "しょうじ",
  網戸: "あみど",
  吸殻: "すいがら",
  卵: "たまご",
  殻: "から",
  金属製: "きんぞくせい",
  金属製以外: "きんぞくせいいがい",
  炭酸: "たんさん",
  段: "だん",
  茶殻: "ちゃがら",
  茶: "ちゃ",
  茶碗: "ちゃわん",
  注射針: "ちゅうしゃしん",
  類: "るい",
  彫刻刀: "ちょうこくとう",
  調味料: "ちょうみりょう",
  調理台: "ちょうりだい",
  使: "つか",
  捨: "す",
  机: "つくえ",
  土: "つち",
  鉢植: "はちう",
  出: "で",
  少量: "しょうりょう",
  棒: "ぼう",
  爪切: "つめき",
  釣: "つ",
  竿: "さお",
  木製: "もくせい",
  手提: "てさ",
  金庫: "きんこ",
  鉄板: "てっぱん",
  用: "よう",
  手袋: "てぶくろ",
  液晶式: "えきしょうしき",
  有機: "ゆうき",
  式: "しき",
  管式: "かんしき",
  台: "だい",
  電気: "でんき",
  電気毛布: "でんきもうふ",
  電球: "でんきゅう",
  電子: "でんし",
  電池: "でんち",
  小型充電式電池: "こがたじゅんでんしきでんち",
  電動: "でんどう",
  自転車: "じてんしゃ",
  電動車: "でんどうくるま",
  天: "てん",
  油: "あぶら",
  電話台: "でんわだい",
  電話帳: "でんわちょう",
  陶磁器類: "とうじきるい",
  籐製家具: "とうせいかぐ",
  籐製品: "とうせいひん",
  豆腐: "とうふ",
  灯油: "とうゆ",
  時計: "とけい",
  置: "お",
  掛: "か",
  戸棚: "とだな",
  鳥: "とり",
  塗料: "とりょう",

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
    `;

    //  説明がある場合のみ追加
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

  // 長音・記号・空白を除去
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

  let history = JSON.parse(localStorage.getItem("searchHistory_special") || "[]");

  // 重複除去
  history = history.filter(w => w !== word);

  history.unshift(word); // 先頭に追加

  if (history.length > 10) history.pop();

  localStorage.setItem("searchHistory_special", JSON.stringify(history));
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

  const queryNorm = normalizeForSearch(raw);

  searchResults = allItems.filter(item => {
    if (item.isLabel) return false;

    const titleNorm = normalizeForSearch(item.title);

    return titleNorm.includes(queryNorm);
  });

  renderSearchResults();
  updatePagingButtons();
}


function showSearchError(message) {
  const box = document.getElementById("searchBox");
  const error = document.getElementById("searchError");

  box.classList.add("error");
  error.textContent = message;
  error.style.display = "block";
}

function clearSearchError() {
  const box = document.getElementById("searchBox");
  const error = document.getElementById("searchError");

  box.classList.remove("error");
  error.textContent = "";
  error.style.display = "none";
}


function renderSearchResults() {
  const container = document.getElementById("itemsContainer");
  container.innerHTML = "";

  if (searchResults.length === 0) {
    container.innerHTML = "<p>該当する品目が見つかりません</p>";
     showSearchError("該当する品目が見つかりません");
    return;
  }
  else {
    clearSearchError();
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

    //  説明がある場合のみ追加
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

  const history = JSON.parse(localStorage.getItem("searchHistory_special") || "[]");

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

  saveSearchHistory(value);  //  ボタン押下時のみ保存
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
  // Enterキーでの検索
  // keydown
  searchBox.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();

      const value = searchBox.value.trim();
      if (!value) return;

      isEnterSearch = true;        //  Enter検索開始
      saveSearchHistory(value);   //  履歴保存
      searchItems();              //  検索実行

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
    if (isEnterSearch) return; //  これがないとEnter2回問題が出る
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
