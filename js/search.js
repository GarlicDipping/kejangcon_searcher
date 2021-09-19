//https://stackoverflow.com/questions/18450659/scroll-textfield-up-when-keyboard-popsup/38593508
var $htmlOrBody = $('html, body'); // scrollTop works on <body> for some browsers, <html> for others
var scrollTopPadding = 8;

function scrollSearchboxToTop() {
    var textareaTop = input.offsetTop;
    // scroll to the textarea
    var timing = 250;
    $htmlOrBody.animate({ scrollTop: textareaTop - scrollTopPadding }, timing);
}

function setup() {
    input.addEventListener("focus", scrollSearchboxToTop);
    input.addEventListener("keyup", function () {
        var val = input.value.trim();
        search_result_table.innerHTML = '';
        if (!val) {
            //공백, Do nothing
            search_result_text.innerHTML = "<p>" + 0 + "개 찻앗구...ㅎ</p>";
            return;
        }
        var regex = createFuzzyMatcher(val);
        var resultDatas = kejangcon_data.filter(function (row) {
            for (const tag of row['tags']) {
                if (regex.test(tag)) {
                    return true;
                }
            }
            return false;
        }).map(function (row) {
            let longestDistance = 0;
            for (const tag of row['tags']) {
                let dist = 0;
                tag.replace(regex, (match, ...groups) => {
                    const letters = groups.slice(0, val.length);
                    let lastIndex = 0;
                    for (let i = 0, l = letters.length; i < l; i++) {
                        const idx = match.indexOf(letters[i], lastIndex);
                        if (lastIndex > 0) {
                            dist = Math.max(dist, idx - lastIndex);
                        }
                        lastIndex = idx + 1;
                    }
                });
                if(dist > longestDistance){
                    longestDistance = dist;
                }
            }
            return { row, longestDistance };
        });
        resultDatas.sort((a, b) => {
            var aRowContainsKeyword = rowTagContainsKeyword(a.row, val);
            var bRowContainsKeyword = rowTagContainsKeyword(b.row, val);
            if(aRowContainsKeyword && !bRowContainsKeyword){
                return -100;
            }
            else if(!aRowContainsKeyword && bRowContainsKeyword){
                return 100;
            }
            else {
                return a.longestDistance - b.longestDistance;
            }
          });

        search_result_text.innerHTML = "<p>" + resultDatas.length + "개 찻앗구...ㅎ</p>";
        for (var i = 0; i < resultDatas.length; i++) {
            var row = resultDatas[i].row;
            var imgName = row.pid;
            var figElem = document.createElement('figure');

            var linkElem = document.createElement('a');
            linkElem.href = getKakaoEmoticonShopLink(row.group_id);

            var imgElem = document.createElement('img');
            imgElem.src = "./img/kejangcon/loading.gif";
            tryImages(imgElem, row.group_id, imgName);
            var figCaptionElem = document.createElement('figcaption');
            figCaptionElem.textContent = '케장콘 ' + row.group_id;
            linkElem.appendChild(imgElem);
            figElem.appendChild(linkElem);
            figElem.appendChild(figCaptionElem);
            search_result_table.appendChild(figElem);
        }
    }, false);

    window.addEventListener('resize', scrollSearchboxToTop);
}

function getKakaoEmoticonShopLink(group_id){
    if(group_id == 1){
        return 'https://e.kakao.com/t/kejang-con';
    }
    else if(group_id == 2){
        return 'https://e.kakao.com/t/kejang-con-ver2';
    }
    else{
        return 'https://e.kakao.com/t/kejang-con-ver-' + group_id;
    }
}

function rowTagContainsKeyword(row, keyword){
    for (const tag of row['tags']) {
        let searchValIndex = tag.indexOf(keyword);
        if(searchValIndex >= 0){
            //유저가 검색한 문자열과 동일한 문자열이 태그에 존재할 경우 그리핀도르에 10점!
            return true;
        }
    }
    return false;
}

function tryImages(img, group_id, name) {
    img.src = "./img/kejangcon/" + group_id + "/" + name + ".png";
    img.onerror = function () {
        img.src = "./img/kejangcon/" + group_id + "/" + name + ".jpg";
        img.onerror = function () {
            img.src = "./img/kejangcon/" + group_id + "/" + name + ".gif";
            img.onerror = function () {
                img.src = "./img/kejangcon/error.png";
            }
        };
    };
}


var input;
var search_result_text;
var search_result_table;

(function (window, document, undefined) {

    // code that should be taken care of right away

    window.onload = init;

    function init() {
        // the code to be called when the dom has loaded
        // #document has its nodes
        input = document.getElementById("search_input");
        search_result_text = document.getElementById("search_result_text");
        search_result_table = document.getElementById("search_result_table");
        search_result_text.innerHTML = "<p>0개 찻앗구...ㅎ</p>";
        setup();
    }

})(window, document, undefined);
