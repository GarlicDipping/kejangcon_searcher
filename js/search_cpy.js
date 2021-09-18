
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
    // escapeRegExp는 lodash에서 가져옴


    return (0, _lodash["default"])(ch);
}

function createFuzzyMatcher(input) {
    var pattern = input.split("").map(ch2pattern).map(function (pattern) {
        return "(" + pattern + ")";
    }).join(".*?");
    return new RegExp(pattern);
}

function emptyResult(result) {
    result.innerHTML = '<em class="no-result">검색 결과가 없습니다.</em>';
}

function setup() {
    var input = document.getElementById("text");
    var result = document.getElementById("result");
    input.addEventListener("keyup", function () {
        var val = input.value.trim();

        if (!val) {
            return emptyResult(result);
        }

        var regex = createFuzzyMatcher(val);

        var resultData = _city_names["default"].filter(function (row) {
            return regex.test(row["행정구역"]);
        }).map(function (row) {
            var longestDistance = 0;
            var city = row["행정구역"].replace(regex, function (match) {
                var _loopIt = 0,
                    _loopIt2 = 0,
                    _loopIt3 = 0;

                for (var _len = arguments.length, groups = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    if (_loopIt3++ > 10001) {
                        var csb_global = typeof window === 'undefined' ? self : window;
                        csb_global.infiniteLoopError = new RangeError('Potential infinite loop: exceeded ' + 10001 + ' iterations. You can disable this check by creating a sandbox.config.json file.');
                        throw csb_global.infiniteLoopError;
                    }

                    if (_loopIt++ > 10001) {
                        var csb_global = typeof window === 'undefined' ? self : window;
                        csb_global.infiniteLoopError = new RangeError('Potential infinite loop: exceeded ' + 10001 + ' iterations. You can disable this check by creating a sandbox.config.json file.');
                        throw csb_global.infiniteLoopError;
                    }

                    groups[_key - 1] = arguments[_key];
                }

                var letters = groups.slice(0, val.length);
                var lastIndex = 0;
                var highlighted = [];

                for (var i = 0, l = letters.length; i < l; i++) {
                    if (_loopIt2++ > 10001) {
                        var csb_global = typeof window === 'undefined' ? self : window;
                        csb_global.infiniteLoopError = new RangeError('Potential infinite loop: exceeded ' + 10001 + ' iterations. You can disable this check by creating a sandbox.config.json file.');
                        throw csb_global.infiniteLoopError;
                    }

                    var idx = match.indexOf(letters[i], lastIndex);
                    highlighted.push(match.substring(lastIndex, idx));
                    highlighted.push("<mark>".concat(letters[i], "</mark>"));

                    if (lastIndex > 0) {
                        longestDistance = Math.max(longestDistance, idx - lastIndex);
                    }

                    lastIndex = idx + 1;
                }

                return highlighted.join("");
            });
            return {
                city: city,
                longestDistance: longestDistance
            };
        });

        resultData.sort(function (a, b) {
            return a.longestDistance - b.longestDistance;
        });
        result.innerHTML = resultData.map(function (_ref) {
            var city = _ref.city;
            return city;
        }).join("\n");
    }, false);
}

setup();