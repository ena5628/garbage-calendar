//  漢字対応 getInitial 
function getInitial(charOrString) {
    if (!charOrString) return null;

    // 文字列の先頭1文字を取得
    let firstChar = charOrString.charAt(0);

    // 1. 英字対応
    const englishChar = firstChar.toUpperCase();
    if (/[A-Z]/.test(englishChar)) {
        switch (englishChar) {
            case 'A': case 'I': case 'U': case 'E': case 'O': return 'あ';
            case 'K': return 'か';
            case 'S': return 'さ';
            case 'T': return 'た';
            case 'N': return 'な';
            case 'H': return 'は';
            case 'M': return 'ま';
            case 'Y': return 'や';
            case 'R': return 'ら';
            case 'W': return 'わ';
            default: return null;
        }
    }

    // 2. 漢字・カタカナをひらがなに変換
    // wanakana.toHiragana は漢字も可能な限り変換
    const hiragana = wanakana.toHiragana(charOrString);
    firstChar = hiragana.charAt(0);

    // 3. 濁点/半濁点/拗音を無視
    const normalizedChar = firstChar.normalize('NFKD').replace(/[\u3099\u309A]/g, '');
    firstChar = normalizedChar;

    // 4. 行判定
    if ('あいうえおぁぃぅぇぉ'.includes(firstChar)) return 'あ';
    if ('かきくけこがぎぐげご'.includes(firstChar)) return 'か';
    if ('さしすせそざじずぜぞ'.includes(firstChar)) return 'さ';
    if ('たちつてとだぢづでどっ'.includes(firstChar)) return 'た';
    if ('なにぬねの'.includes(firstChar)) return 'な';
    if ('はひふへほばびぶべぼぱぴぷぺぽ'.includes(firstChar)) return 'は';
    if ('まみむめも'.includes(firstChar)) return 'ま';
    if ('やゆよゃゅょ'.includes(firstChar)) return 'や';
    if ('らりるれろ'.includes(firstChar)) return 'ら';
    if ('わをん'.includes(firstChar)) return 'わ';

    return null;
}
