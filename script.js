// ================================
// 町名・丁目リスト
// ================================
const nakayamateList = ["1丁目(山手幹線より北)","1丁目(山手幹線より南)","2丁目(山手幹線より北)","2丁目(山手幹線より南)","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目(山手幹線より北)","4丁目(山手幹線より南)","5丁目","6丁目","7丁目","8丁目"];
const ninomiyaList = ["1丁目(山手幹線より北)","1丁目(山手幹線より南)","2丁目(山手幹線より北)","2丁目(山手幹線より南)","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目(山手幹線より北)","4丁目(山手幹線より南)"];
const kanouList = ["1丁目","2丁目","3丁目(山手幹線より北)","3丁目(山手幹線より南)","4丁目","5丁目","6丁目"];
const kitanoList = ["1丁目","2丁目","3丁目","4丁目"];
const nunobikiList = ["1丁目","2丁目","3丁目","4丁目"];
const kotonoList = ["1丁目","2丁目","3丁目","4丁目","5丁目"];

// ================================
// DOM
// ================================
const townSelect  = document.getElementById("townSelect");
const chomeSelect = document.getElementById("chomeSelect");
const cardboardBox = document.getElementById("cardboardScheduleBox");

let schedules = [];
let cardboardSchedules = [];

// ================================
// 初期化
// ================================
document.addEventListener("DOMContentLoaded", () => {
    restoreSelectionFromSession();
    loadSchedule();
    loadCardboardSchedule();
    toggleScheduleVisibility();
    loadTips();

    townSelect.addEventListener("change", handleSelectionChange);
    chomeSelect.addEventListener("change", handleSelectionChange);
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
            case "容器包装プラスチック": return "#CC9933"; // 黄色系を暗め
            case "缶・ビン・ペットボトル": return "#3399CC"; // 青系を暗め
            default: return "#555555";                 // その他暗め
        }
    } else {
        // ライトモード用（元の色）
        switch (kind) {
            case "燃えるゴミ": return "#FF6666";
            case "燃えないゴミ": return "#999999";
            case "容器包装プラスチック": return "#FFCC66";
            case "缶・ビン・ペットボトル": return "#66CCFF";
            default: return "#CCCCCC";
        }
    }
}


// ================================
// 段ボール判定
// ================================
function isCardboardDay(date, town, chome) {
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

    const targets = cardboardSchedules.filter(r => r.town === town && r.chome === chome);

    if (targets.length === 0) {
        cardboardBox.textContent = "段ボール収集情報がありません";
        return;
    }

    const icon = document.createElement("img");
    icon.src = "Image/段ボール-Photoroom.png";
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
            box.style.backgroundColor = s.color || getDefaultColor(s.gomiKind);

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

    const todayList = schedule.filter(s => isSameDate(s.date, today));

    if (todayList.length === 0) {
        const div = document.createElement("div");
        div.className = "gomi-box today-main no-collection";
        div.textContent = "ゴミ収集なし";
        container.appendChild(div);
    } else {
        todayList.forEach(s => {
            const div = document.createElement("div");
            div.className = "gomi-box today-main";
            div.style.backgroundColor = s.color || getDefaultColor(s.gomiKind);
            div.textContent = s.gomiKind;
            container.appendChild(div);
        });
    }

    const cardboard = isCardboardDay(today, townSelect.value.trim(), chomeSelect.value.trim());
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
});

// ページロード時に前回の設定を反映
if(localStorage.getItem('darkMode') === 'true'){
    document.body.classList.add('dark-mode');
    darkToggleBtn.textContent = 'ライトモード';
}

