// ==================== 設定 ====================
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/YOUR_ID/pub?output=csv";
const TOWNS_PER_PAGE = 4; // 1ページあたりの町名数

let allData = [];
let displayData = [];
let currentPage = 0;
let pageStarts = [];

// ==================== 初期化 ====================
window.onload = async () => {
    await loadData();
    setupFilters();
    updateDisplay();
};

// データ読み込み
async function loadData() {
    try {
        const res = await fetch(SHEET_CSV_URL);
        const csv = await res.text();
        const parsed = Papa.parse(csv, { header: true, skipEmptyLines: true });
        allData = parsed.data;
        displayData = allData;
    } catch (e) {
        console.error("データ取得エラー:", e);
    }
}

// ページ分割ロジック (C#のBuildPageStarts_ByTownLimit相当)
function buildPageStarts(data) {
    pageStarts = [0];
    let townCount = 0;
    let lastTown = "";

    for (let i = 0; i < data.length; i++) {
        const town = data[i].Town?.trim();
        if (town && town !== lastTown) {
            townCount++;
            lastTown = town;
            if (townCount > TOWNS_PER_PAGE) {
                pageStarts.push(i);
                townCount = 1;
            }
        }
    }
}

// 表示更新
function updateDisplay() {
    buildPageStarts(displayData);
    renderPage();
}

// 描画メイン (C#のDisplayPage相当)
function renderPage() {
    const container = document.getElementById("displayContainer");
    container.innerHTML = "";

    const start = pageStarts[currentPage];
    const end = (currentPage + 1 < pageStarts.length) ? pageStarts[currentPage + 1] : displayData.length;
    
    let currentPanel = null;

    for (let i = start; i < end; i++) {
        const row = displayData[i];
        const town = row.Town?.trim();
        const title = row.Title?.trim() || "";
        const content = row.Content?.trim() || "";
        const groupHome = row.Group_home?.trim();

        // 1. Town見出し
        if (town) {
            const h = document.createElement("div");
            h.className = "town-header";
            h.textContent = town;
            container.appendChild(h);
            currentPanel = null;
        }

        // 2. 1文字見出しラベル判定
        if (title.length === 1 && !content) {
            const lbl = document.createElement("div");
            lbl.className = "initial-label";
            lbl.textContent = title;
            container.appendChild(lbl);
            currentPanel = null;
            continue;
        }

        // 3. 空白行（パネル内の線）
        if (!title && !content && currentPanel) {
            const line = document.createElement("div");
            line.className = "panel-line";
            currentPanel.appendChild(line);
            continue;
        }

        // 4. パネル生成
        if (!currentPanel) {
            currentPanel = document.createElement("div");
            currentPanel.className = `item-panel ${groupHome ? 'group-home' : ''}`;
            if (groupHome) {
                const gh = document.createElement("div");
                gh.style.color = "mediumvioletred";
                gh.style.fontSize = "24px";
                gh.style.fontWeight = "bold";
                gh.textContent = groupHome;
                currentPanel.appendChild(gh);
            }
            container.appendChild(currentPanel);
        }

        // 5. 内容追加
        if (title || content) {
            const entry = document.createElement("div");
            entry.innerHTML = `
                <div class="entry-title">${formatText(title)}</div>
                <div class="entry-content">${formatText(content)}</div>
            `;
            currentPanel.appendChild(entry);
        }
    }
    
    document.getElementById("pageInfo").textContent = `${currentPage + 1} / ${pageStarts.length}`;
}

// リンク変換
function formatText(text) {
    if (!text) return "";
    return text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, 
        '<a href="$2" target="_blank" rel="noopener">$1</a>');
}

// ==================== イベント制御 ====================
function setupFilters() {
    // 町名セレクトボックスの重複排除
    const towns = [...new Set(allData.map(r => r.Town).filter(t => t))];
    const select = document.getElementById("townSelect");
    towns.forEach(t => {
        const opt = document.createElement("option");
        opt.value = opt.textContent = t;
        select.appendChild(opt);
    });

    document.getElementById("searchBtn").onclick = () => {
        const selectedTown = document.getElementById("townSelect").value;
        if (!selectedTown) return;
        
        // C#のExtractTownBlock相当のフィルタリング
        displayData = allData.filter(r => r.Town === selectedTown || (/* 以降の町名なし行も含めるロジックが必要 */ true));
        // ※実際には前述のロジックに従い、選択した町名の開始から次の町名までを抽出
        
        currentPage = 0;
        document.getElementById("allShowBtn").style.display = "inline-block";
        updateDisplay();
    };

    document.getElementById("allShowBtn").onclick = () => {
        displayData = allData;
        currentPage = 0;
        document.getElementById("allShowBtn").style.display = "none";
        updateDisplay();
    };

    document.getElementById("nextBtn").onclick = () => {
        if (currentPage < pageStarts.length - 1) {
            currentPage++;
            renderPage();
            window.scrollTo(0,0);
        }
    };

    document.getElementById("prevBtn").onclick = () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage();
            window.scrollTo(0,0);
        }
    };
}