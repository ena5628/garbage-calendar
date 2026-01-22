// ================================
// 町名・丁目リスト
// ================================
const nakayamateList = ["1丁目(山手幹線より北)","1丁目(山手幹線より南)","2丁目(山手幹線より北)","2丁目(山手幹線より南)","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目(山手幹線より北)","4丁目(山手幹線より南)","5丁目","6丁目","7丁目","8丁目"];
const ninomiyaList = ["1丁目(山手幹線より北)","1丁目(山手幹線より南)","2丁目(山手幹線より北)","2丁目(山手幹線より南)","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目(山手幹線より北)","4丁目(山手幹線より南)"];
const kanouList = ["1丁目","2丁目","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目","5丁目","6丁目"];
const kitanoList = ["1丁目","2丁目","3丁目","4丁目"];
const nunobikiList = ["1丁目","2丁目","3丁目","4丁目"];
const kotonoList = ["1丁目","2丁目","3丁目","4丁目","5丁目"];

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


// ================================
// 段ボール回収除外ルール（町・丁目限定）
// ================================
const cardboardExcludeRules = [
    {
        town: "中山手通",
        chome: "8丁目",
        periods: [
            { from: "12/31", to: "1/4" },   // 年末年始
            { from: "8/13",  to: "8/16" }   // お盆
        ]
    },

];


// ================================
// DOM
// ================================
const townSelect  = document.getElementById("townSelect");
const chomeSelect = document.getElementById("chomeSelect");
const cardboardBox = document.getElementById("cardboardScheduleBox");

let schedules = [];
let cardboardSchedules = [];

// 家電ゴミ＆特殊ごみのデータ
let kadenItems = new Set();     // 家電ゴミ品目
let specialItems = new Set();  // 特殊ごみ品目

// ================================
// 初期化
// ================================
document.addEventListener("DOMContentLoaded", async () => {

    // 最初は選択不可
    townSelect.disabled = true;
    chomeSelect.disabled = true;

    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) loadingIndicator.style.display = "block";

    restoreSelectionFromSession();
    // データロードを並列化
    await Promise.all([
        loadSchedule(),
        loadCardboardSchedule()
    ]);
    toggleScheduleVisibility();
    // 選択可能にする
    townSelect.disabled = false;
    chomeSelect.disabled = false;
    await loadKadenAndSpecialGarbage();
    loadTips();


    if (loadingIndicator) loadingIndicator.style.display = "none";


    townSelect.addEventListener("change", handleSelectionChange);
    chomeSelect.addEventListener("change", handleSelectionChange);

    const openBtn  = document.getElementById("openWeekModal");
    const closeBtn = document.getElementById("closeWeekModal");
    const modal    = document.getElementById("weekModal");

    if (openBtn && closeBtn && modal) {
        openBtn.addEventListener("click", () => {
        // ▼ sessionStorage から値を復元してセレクトに反映
        const savedTown  = sessionStorage.getItem('selectedTown');
        const savedChome = sessionStorage.getItem('selectedChome');

        if (savedTown) townSelect.value = savedTown;
        if (savedChome) chomeSelect.value = savedChome;

        // ▼ 町名に応じて丁目リストを更新
        handleSelectionChange(); // これでカレンダーも更新される

        // ▼ モーダル用に月カレンダー描画
        renderMonthlyCalendarInWeekModal();

        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });
}

});


// 家電＆特殊ごみデータ取得
async function loadKadenAndSpecialGarbage() {
    const kadenCSV =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vTcgcKTLcJOUEmZQ4VYFueERLuygVMLE38lJBCnIRAezueNu2PmlXeYhGzd0lxeBvFvwRVEvtiYGTxt/pub?output=csv";
    const specialCSV =
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vQs1Zbj7FUpACpnArctI5kRf70CvsB89lpds2A3FxaDPDLdVCt2Kl5QZ8TRWaQqg3ff9SL1kOZd18zo/pub?output=csv";

    const [kadenText, specialText] = await Promise.all([
        fetch(kadenCSV).then(res => res.text()),
        fetch(specialCSV).then(res => res.text())
    ]);

    const kadenRows = Papa.parse(kadenText, { header: true, skipEmptyLines: true }).data;
    const specialRows = Papa.parse(specialText, { header: true, skipEmptyLines: true }).data;

    // ▼ 品目名と種類をオブジェクトで保持
    kadenItems = kadenRows.map(r => ({
        name: r["Garbage_title"].trim(),
        type: "家電ゴミ"
    }));

    specialItems = specialRows.map(r => ({
        name: r["Garbage_title"].trim(),
        type: "特殊ゴミ"
    }));

    console.log("家電ゴミ件数:", kadenItems.length);
    console.log("特殊ごみ件数:", specialItems.length);

    updateAllGarbageItems(); // 検索対象配列を更新
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


// 検索ボックスと結果領域
const searchBox = document.getElementById("searchBox");
const garbageSearchResult = document.getElementById("garbageSearchResult");

// すべての検索対象を配列にまとめる
let allGarbageItems = []; // kadenItems + specialItems

function updateAllGarbageItems() {
    allGarbageItems = [...kadenItems, ...specialItems];
}

// 検索ボタン用（右の虫眼鏡ボタン）
function handleSearchButton() {
    const query = searchBox.value;
    const results = searchGarbage(query);
    renderGarbageSearchResults(results, query);
}

// 実際の検索処理
function searchGarbage(query) {
    if (!query) return [];

    query = normalizeText(query); // 入力を正規化

    const results = allGarbageItems.filter(itemObj => {
        let normalizedItem = normalizeText(itemObj.name);

        // 漢字→読み仮名変換（KanjiToInitial があれば）
        if (typeof KanjiToInitial !== "undefined") {
            Object.keys(KanjiToInitial)
                .sort((a, b) => b.length - a.length)
                .forEach(k => {
                    normalizedItem = normalizedItem.replaceAll(k, KanjiToInitial[k]);
                });
        }

        normalizedItem = normalizeText(normalizedItem);

        return normalizedItem.includes(query);
    });

    return results;
}


// 検索結果表示
function renderGarbageSearchResults(results, query) {
    garbageSearchResult.innerHTML = ""; // まずは空にする

    if (!results || results.length === 0 || query.length <= 1) {
        garbageSearchResult.textContent = "該当する品目はありません";

        // 検索ボックスにエラークラスを追加
        searchBox.classList.add("error");
        return;
    }

    // 検索結果がある場合はエラー表示を消す
    searchBox.classList.remove("error");

    // 1件だけ表示して、件数が複数なら末尾に "..." を追加
    let text = `${results[0].name}は${results[0].type}コーナーにあります。`;

    if (results.length > 1) {
        text += " ...";
    }

    garbageSearchResult.textContent = text;
}



// DOMContentLoaded 時に検索対象を初期化
document.addEventListener("DOMContentLoaded", () => {
    updateAllGarbageItems();
});

// 入力時にチェックしてエラー表示を解除
searchBox.addEventListener("input", () => {
    if (searchBox.value.length === 0) {
        searchBox.classList.remove("error");
        garbageSearchResult.textContent = ""; // 結果もクリア
    }
});

// Enterキーで検索を実行
searchBox.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault(); // フォーム送信などを防ぐ
        handleSearchButton();   // ボタンと同じ処理を実行
    }
});




// ================================
// 選択変更共通処理
// ================================
function handleSelectionChange() {
    const town  = townSelect.value.trim();

    // 丁目リストの動的設定
    let list = [];
    if (town === "中山手通") list = nakayamateList;
    else if (town === "加納町") list = kanouList;
    else if (town === "二宮町") list = ninomiyaList;
    else if (town === "北野町") list = kitanoList;
    else if (town === "布引町") list = nunobikiList;
    else if (town === "琴ノ緒町") list = kotonoList;

    if (townSelect === document.activeElement) {
        chomeSelect.innerHTML = "";
        addOptions(chomeSelect, ["〇丁目など", ...list]);
    }

    if (isTownAndChomeSelected()) {
        updateCalendar();
        renderCardboardScheduleLabel();
    }

    toggleScheduleVisibility();
    saveSelectionToSession();
}

// ================================
// セレクト保存・復元
// ================================
function saveSelectionToSession() {
    sessionStorage.setItem('selectedTown', townSelect.value);
    sessionStorage.setItem('selectedChome', chomeSelect.value);

    const chomeOptions = Array.from(chomeSelect.options).map(opt => opt.text);
    sessionStorage.setItem('chomeOptions', JSON.stringify(chomeOptions));
}

function restoreSelectionFromSession() {
    const savedTown  = sessionStorage.getItem('selectedTown');
    const savedChome = sessionStorage.getItem('selectedChome');
    const savedChomeOptions = sessionStorage.getItem('chomeOptions');

    if (savedTown) townSelect.value = savedTown;

    if (savedChomeOptions) {
        chomeSelect.innerHTML = '';
        const optionsArray = JSON.parse(savedChomeOptions);
        addOptions(chomeSelect, optionsArray);
    }

    if (savedChome) chomeSelect.value = savedChome;
}

// ================================
// ヘルパー
// ================================
function addOptions(select, list) {
    list.forEach(text => {
        const opt = document.createElement("option");
        opt.textContent = text;
        select.appendChild(opt);
    });
}

function isTownAndChomeSelected() {
    const town  = townSelect.value.trim();
    const chome = chomeSelect.value.trim();
    return town !== "町名を選択してください" && chome !== "〇丁目など";
}

// ================================
// 日付・カレンダー関連
// ================================
function getThisWeek(today = new Date()) {
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - today.getDay());
    return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(sunday);
        d.setDate(sunday.getDate() + i);
        return d;
    });
}


function getWeekOfMonth(date, targetDayOfWeek) {
    let count = 0;
    const d = new Date(date.getFullYear(), date.getMonth(), 1);
    while (d <= date) {
        if (d.getDay() === targetDayOfWeek) count++;
        d.setDate(d.getDate() + 1);
    }
    return count;
}

function isSameDate(a, b) {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
}

function getDefaultColor(kind) {
    if (document.body.classList.contains('dark-mode')) {
        // ダークモード用少し暗めの色
        switch (kind) {
            case "燃えるゴミ": return "#CC4444";       // 赤系を暗め
            case "燃えないゴミ": return "#666666";     // グレーを暗め
            case "容器包装プラスチック": return "#e6b24aff"; // 黄色系を暗め
            case "缶・ビン・ペットボトル": return "#88ce88ff"; // 青系を暗め
            default: return "#555555";                 // その他暗め
        }
    } else {
        // ライトモード用（元の色）
        switch (kind) {
            case "燃えるゴミ": return "#fa7070";
            case "燃えないゴミ": return "#999999";
            case "容器包装プラスチック": return "#ffce6b";
            case "缶・ビン・ペットボトル": return "#acf2ac";
            default: return "#CCCCCC";
        }
    }
}


// 今月のカレンダー表示
function getGarbageTypesForDate(date, town, chome) {
    const result = [];

    schedules.forEach(s => {
        if (s.town !== town) return;
        if (s.chome !== chome) return;
        if (date.getDay() !== s.collectionDay) return;

        const week = getWeekOfMonth(date, s.collectionDay);

        if (
            s.frequency === "毎週" ||
            week === s.week1 ||
            week === s.week2
        ) {
            result.push(s.gomiKind);
        }
    });

    return result;
}


// 現在の年月
const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth(); // 0始まり

// 月ごとのカレンダーの表示（年は固定）
function renderMonthlyCalendarInWeekModal(month) {
    const content = document.getElementById("weekModalContent");
    const title   = document.getElementById("weekModalTitle");
    if (!content || !title) return;

    content.innerHTML = "";

    const town  = sessionStorage.getItem("selectedTown")  || townSelect.value;
    const chome = sessionStorage.getItem("selectedChome") || chomeSelect.value;

    if (!town || !chome || town === "町名を選択してください" || chome === "〇丁目など") {
        content.textContent = "町名・丁目を選択してください";
        return;
    }

    if (month === undefined) month = today.getMonth();

    currentMonth = month;

    // タイトル + 前後月ボタン
    const header = document.createElement("div");
    header.className = "month-calendar-nav";

    const prevBtn = document.createElement("button");
    prevBtn.innerHTML = "◀";
    prevBtn.onclick = () => {
        let m = currentMonth - 1;
        if (m < 0) m = 11;  // 年は固定
        renderMonthlyCalendarInWeekModal(m);
    };

    const nextBtn = document.createElement("button");
    nextBtn.innerHTML = "▶";
    nextBtn.onclick = () => {
        let m = currentMonth + 1;
        if (m > 11) m = 0;  // 年は固定
        renderMonthlyCalendarInWeekModal(m);
    };

    const titleSpan = document.createElement("span");
    titleSpan.textContent = `${currentYear}年${currentMonth + 1}月のゴミ収集カレンダー`;

    header.appendChild(prevBtn);
    header.appendChild(titleSpan);
    header.appendChild(nextBtn);

    title.innerHTML = "";
    title.appendChild(header);

    // カレンダー作成
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth  = new Date(currentYear, currentMonth + 1, 0);
    const startDayIndex = firstDayOfMonth.getDay();

    const calendar = document.createElement("div");
    calendar.className = "month-calendar";

    // 曜日
    ["日","月","火","水","木","金","土"].forEach(day => {
        const w = document.createElement("div");
        w.className = "month-weekday";
        w.textContent = day;
        calendar.appendChild(w);
    });

    // 前月末
    const prevMonthLastDate = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startDayIndex - 1; i >= 0; i--) {
        const box = document.createElement("div");
        box.className = "month-day other-month";
        const dateDiv = document.createElement("div");
        dateDiv.className = "date";
        dateDiv.textContent = prevMonthLastDate - i;
        box.appendChild(dateDiv);
        calendar.appendChild(box);
    }

    // 今月
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        const date = new Date(currentYear, currentMonth, d);
        const box = document.createElement("div");
        box.className = "month-day";

        const dateDiv = document.createElement("div");
        dateDiv.className = "date";
        dateDiv.textContent = d;
        box.appendChild(dateDiv);

        if (date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()) {
            box.classList.add("today");
        }

        const typesContainer = document.createElement("div");
        typesContainer.className = "types";

        getGarbageTypesForDate(date, town, chome).forEach(kind => {
            const g = document.createElement("div");
            g.className = "gomi-box";
            g.style.backgroundColor = getDefaultColor(kind);
            g.textContent = kind;
            typesContainer.appendChild(g);
        });

        if (isCardboardDay(date, town, chome)) {
            const g = document.createElement("div");
            g.className = "gomi-box cardboard";
            g.innerHTML = `<i class="fa-solid fa-box"></i> 段ボール`;
            typesContainer.appendChild(g);
        }

        box.appendChild(typesContainer);
        calendar.appendChild(box);
    }

    // 翌月初
    for (let i = 1; calendar.childNodes.length % 7 !== 0; i++) {
        const box = document.createElement("div");
        box.className = "month-day other-month";
        const dateDiv = document.createElement("div");
        dateDiv.className = "date";
        dateDiv.textContent = i;
        box.appendChild(dateDiv);
        calendar.appendChild(box);
    }

    const wrapper = document.createElement("div");
    wrapper.className = "month-calendar-wrapper";
    wrapper.appendChild(calendar);
    content.appendChild(wrapper);
}

// 初回表示（現在の年・月）
renderMonthlyCalendarInWeekModal(today.getMonth());




// ================================
// 段ボール判定
// ================================

function isDateInPeriod(date, from, to) {
    const year = date.getFullYear();

    const [fromMonth, fromDay] = from.split('/').map(Number);
    const [toMonth, toDay]     = to.split('/').map(Number);

    const start = new Date(year, fromMonth - 1, fromDay);
    let end     = new Date(year, toMonth - 1, toDay);

    // 年をまたぐケース（12/31 → 1/4）
    if (end < start) {
        if (date >= start) {
            end = new Date(year + 1, toMonth - 1, toDay);
        } else {
            start.setFullYear(year - 1);
        }
    }

    return date >= start && date <= end;
}

function isCardboardExcluded(date, town, chome) {
    return cardboardExcludeRules.some(rule => {
        if (rule.town !== town) return false;
        if (rule.chome !== chome) return false;

        return rule.periods.some(p =>
            isDateInPeriod(date, p.from, p.to)
        );
    });
}


function isCardboardDay(date, town, chome) {

        // 町・丁目限定の除外ルール
    if (isCardboardExcluded(date, town, chome)) {
        return null;
    }

    for (const r of cardboardSchedules) {
        if (r.town !== town) continue;
        if (r.chome !== chome) continue;
        if (date.getDay() !== r.collectionDay) continue;
        const week = getWeekOfMonth(date, r.collectionDay);
        if (week === r.week1 || week === r.week2) return r.label;
    }
    return null;
}

function renderCardboardScheduleLabel() {
    if (!cardboardBox) return;
    cardboardBox.innerHTML = "";

    const town  = townSelect.value.trim();
    const chome = chomeSelect.value.trim();

    if (!isTownAndChomeSelected()) {
        cardboardBox.textContent = "町名・丁目を選択してください";
        return;
    }

    // 今日が除外期間なら表示しない
    const today = new Date();
    if (isCardboardExcluded(today, town, chome)) {
        cardboardBox.textContent = "段ボール回収は対象期間外です";
        return;
    }

    const targets = cardboardSchedules.filter(r => r.town === town && r.chome === chome);

    if (targets.length === 0) {
        cardboardBox.textContent = "段ボール収集情報がありません";
        return;
    }

    const icon = document.createElement("img");
    icon.src = "Image/cardboard-Photoroom.png";
    icon.alt = "段ボール";

    const text = document.createElement("span");
    text.textContent = targets[0].label;

    cardboardBox.appendChild(icon);
    cardboardBox.appendChild(text);
}

// ================================
// カレンダー描画
// ================================
function renderWeekCalendar(schedule, today = new Date()) {
    const container = document.getElementById("weekCalendar");
    container.innerHTML = "";

    const town  = townSelect.value.trim();
    const chome = chomeSelect.value.trim();
    if (!isTownAndChomeSelected()) return;

    const week = getThisWeek(today);
    const dayNames = ["日","月","火","水","木","金","土"];

    const baseMonth = today.getMonth(); 

    week.forEach(date => {
        const wrapper = document.createElement("div");
        wrapper.className = "day-column-wrapper";

        const label = document.createElement("div");
        label.className = "weekday-label";
        label.textContent = dayNames[date.getDay()];
        wrapper.appendChild(label);

        const panel = document.createElement("div");
        panel.className = "day-panel";
        if (isSameDate(date, today)) panel.classList.add("today");

        if (date.getMonth() !== baseMonth) {
            panel.classList.add("other-month");
        }

        const num = document.createElement("div");
        num.className = "day-number";
        num.textContent = date.getDate();
        panel.appendChild(num);

        const cardboard = isCardboardDay(date, town, chome);
        if (cardboard) {
            const box = document.createElement("div");
            box.className = "gomi-box cardboard";
            box.innerHTML = `<i class="fa-solid fa-box"></i> 段ボール`;
            panel.appendChild(box);
        }

        schedule.filter(s => isSameDate(s.date, date)).forEach(s => {
            const box = document.createElement("div");
            box.className = "gomi-box";
            box.style.backgroundColor = getDefaultColor(s.gomiKind);
            box.textContent = s.gomiKind;
            panel.appendChild(box);
        });

        wrapper.appendChild(panel);
        container.appendChild(wrapper);
    });
}

// ================================
// 今日のゴミ描画
// ================================
function renderTodayGarbage(schedule, today = new Date()) {
    const container = document.getElementById("todayGarbageContent");
    container.innerHTML = "";

    if (!isTownAndChomeSelected()) return;

    const town  = townSelect.value.trim();
    const chome = chomeSelect.value.trim();

    const todayList = schedule.filter(s => isSameDate(s.date, today));
    const cardboard = isCardboardDay(today, town, chome);

    // ▼ どちらも無い場合だけ「ゴミ収集なし」
    if (todayList.length === 0 && !cardboard) {
        const div = document.createElement("div");
        div.className = "gomi-box today-main no-collection";
        div.textContent = "ゴミ収集なし";
        container.appendChild(div);
        return;
    }

    // ▼ 通常ゴミ
    todayList.forEach(s => {
        const div = document.createElement("div");
        div.className = "gomi-box today-main";
        div.style.backgroundColor =
            document.body.classList.contains('dark-mode')
                ? getDefaultColor(s.gomiKind)
        : (s.color || getDefaultColor(s.gomiKind));
        div.textContent = s.gomiKind;
        container.appendChild(div);
    });

    // ▼ 段ボール
    if (cardboard) {
        const div = document.createElement("div");
        div.className = "gomi-box today-main cardboard";
        div.innerHTML = `<i class="fa-solid fa-box"></i> 段ボール`;
        container.appendChild(div);
    }
}


// ================================
// データ取得
// ================================
async function loadSchedule() {
    const url = "https://script.google.com/macros/s/AKfycbxtYvXyBWTJoozJQcl-9S0WSZb2N_EPtemqyfQGF86PH37_3MdUF9Gve2LgF6YLXmjsNg/exec";
    const res = await fetch(url);
    const rows = await res.json();

    schedules = rows.map(r => ({
        town: r["町名"].trim(),
        chome: r["丁目"].trim(),
        gomiKind: r["ゴミ種別"].trim(),
        collectionDay: Number(r["曜日"]) % 7,
        frequency: r["頻度"],
        week1: r["第1"] ? Number(r["第1"]) : null,
        week2: r["第2"] ? Number(r["第2"]) : null,
        color: r["色"]
    }));

    updateCalendar();
}

async function loadCardboardSchedule() {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpN5XIQ5DmEdvyXJxF-3RkBZImfId8KrBEGqH6UL_Ft6i0alF9mlEb_N8Svg6QDSsHs9by2oa_IcUA/pub?output=csv";
    const csvText = await (await fetch(csvUrl)).text();

    const rows = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;

    cardboardSchedules = rows.map(r => ({
        town: r.Town.trim(),
        chome: r.Chome.trim(),
        collectionDay: Number(r.DayOfWeek),
        week1: r.Week1 ? Number(r.Week1) : null,
        week2: r.Week2 ? Number(r.Week2) : null,
        label: r.Label
    }));

    renderCardboardScheduleLabel();
    updateCalendar();
}

// ================================
// カレンダー更新
// ================================
function updateCalendar() {
    if (!isTownAndChomeSelected()) return;

    const town  = townSelect.value.trim();
    const chome = chomeSelect.value.trim();

    const filtered = schedules.filter(s => s.town === town && s.chome === chome);
    const weekly = [];

    getThisWeek().forEach(date => {
        filtered.forEach(s => {
            if (date.getDay() !== s.collectionDay) return;
            const week = getWeekOfMonth(date, s.collectionDay);
            if (s.frequency === "毎週" || week === s.week1 || week === s.week2) {
                weekly.push({ ...s, date });
            }
        });
    });

    renderWeekCalendar(weekly);
    renderTodayGarbage(weekly);
}

// ================================
// 今日・今週パネル表示制御
// ================================
function toggleScheduleVisibility() {
    const todayWrapper = document.getElementById("todayGarbageWrapper");
    const weekWrapper  = document.getElementById("weekScheduleWrapper");

    const visible = isTownAndChomeSelected();

    todayWrapper.style.display = visible ? "block" : "none";
    weekWrapper.style.display  = visible ? "block" : "none";

    if (!visible && cardboardBox) {
        cardboardBox.innerHTML = "";
        cardboardBox.textContent = "町名・丁目を選択してください";
    }
}

// ================================
// Tips表示
// ================================
const tipsCSVUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQBaTNlrgReNS7OcyTcMh_bzGW4YEvb4jUjsfhic5qsJq2gIZWUej2fYSZOGhsrdwIbUZxIc9nzMAyZ/pub?gid=0&single=true&output=csv';
function loadTips() {
    const tipsBox = document.querySelector('.tips-box');

    Papa.parse(tipsCSVUrl, {
        download: true,
        header: true,
        complete: function(results) {
            const tipsList = results.data.filter(row => row.Garbage_contents && row.Garbage_contents.trim() !== '');
            if (tipsList.length > 0) {
                const randomTip = tipsList[Math.floor(Math.random() * tipsList.length)];

                // --- 閉じるボタンなし ---
                tipsBox.innerHTML = `
                    <div class="tips-title-panel">${randomTip.Garbage_title}</div>
                    <div class="tips-content-panel">${randomTip.Garbage_contents}</div>
                `;

                // 常に表示
                tipsBox.style.display = 'block';
                tipsBox.classList.remove('show');
                setTimeout(() => tipsBox.classList.add('show'), 100);
            }
        },
        error: function(err) { console.error('Tips読み込み失敗:', err); }
    });
}



// ================================
// ページ離脱前に状態を保存
// ================================
window.addEventListener('beforeunload', saveSelectionToSession);


// ダークモード切り替え
const darkToggleBtn = document.getElementById('darkModeToggle');

darkToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if(document.body.classList.contains('dark-mode')){
        darkToggleBtn.textContent = 'ライトモード';
    } else {
        darkToggleBtn.textContent = 'ダークモード';
    }

    // 選択状態を localStorage に保存
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));

        // 即再描画
    updateCalendar();
    renderCardboardScheduleLabel();
});

// ページロード時に前回の設定を反映
if(localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark-mode');
    darkToggleBtn.textContent = 'ライトモード';
}

