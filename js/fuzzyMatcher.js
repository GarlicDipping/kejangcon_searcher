///Codes are ripped from https://taegon.kim/archives/9919

function ch2pattern(ch) {
    var offset = 44032;
    /* '가'의 코드 */
    // 한국어 음절

    if (/[가-힣]/.test(ch)) {
        var chCode = ch.charCodeAt(0) - offset; // 종성이 있으면 문자 그대로를 찾는다.

        if (chCode % 28 > 0) {
            return ch;
        }

        var begin = Math.floor(chCode / 28) * 28 + offset;
        var end = begin + 27;
        return "[\\u".concat(begin.toString(16), "-\\u").concat(end.toString(16), "]");
    } // 한글 자음


    if (/[ㄱ-ㅎ]/.test(ch)) {
        var con2syl = {
            ㄱ: "가".charCodeAt(0),
            ㄲ: "까".charCodeAt(0),
            ㄴ: "나".charCodeAt(0),
            ㄷ: "다".charCodeAt(0),
            ㄸ: "따".charCodeAt(0),
            ㄹ: "라".charCodeAt(0),
            ㅁ: "마".charCodeAt(0),
            ㅂ: "바".charCodeAt(0),
            ㅃ: "빠".charCodeAt(0),
            ㅅ: "사".charCodeAt(0)
        };

        var _begin = con2syl[ch] || (ch.charCodeAt(0) - 12613) *
            /* 'ㅅ'의 코드 */
            588 + con2syl["ㅅ"];

        var _end = _begin + 587;

        return "[".concat(ch, "\\u").concat(_begin.toString(16), "-\\u").concat(_end.toString(16), "]");
    } // 그 외엔 그대로 내보냄

    return escapeRegExp(ch);
}

function createFuzzyMatcher(input) {
    var pattern = input.split("").map(ch2pattern).map(function (pattern) {
        return "(" + pattern + ")";
    }).join(".*?");
    return new RegExp(pattern);
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }
  