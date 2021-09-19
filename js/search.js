//https://stackoverflow.com/questions/18450659/scroll-textfield-up-when-keyboard-popsup/38593508
var $htmlOrBody = $('html, body'), // scrollTop works on <body> for some browsers, <html> for others
    scrollTopPadding = 8;

function scrollSearchboxToTop(){
    var textareaTop = $(this).offset().top;
    // scroll to the textarea
    var timing = 250;
    $htmlOrBody.animate({ scrollTop: textareaTop - scrollTopPadding }, timing);    
}
function setup() {
    input.addEventListener("focus", scrollSearchboxToTop);
    input.addEventListener("keyup", function () {
        scrollSearchboxToTop();
        var val = input.value.trim();
        // var columnWrappers = [];
        search_result_table.innerHTML = '';
        if (!val) {
            //공백, Do nothing
            search_result_text.innerHTML = "<p>" + 0 + "개 찻앗구...ㅎ</p>";
            return;
        }
        var regex = createFuzzyMatcher(val);
        var resultDatas = kejangcon_data.filter(function (row) {
            return regex.test(row["tags"]);
        });
        search_result_text.innerHTML = "<p>" + resultDatas.length + "개 찻앗구...ㅎ</p>";
        // var row_count = Math.floor(resultDatas.length / 4) + 1;        
        // for(var i = 0; i < row_count; i++){
        //     columnWrappers[i] = document.createElement('div');
        //     columnWrappers[i].className = 'column';
        //     columnWrappers[i].id = 'col_' + i;
        //     //('<div class="column" id="col_' + i + '"></div>');
        //     search_result_table.appendChild(columnWrappers[i]);
        // }
        for(var i = 0; i < resultDatas.length; i++){
            var imgName = resultDatas[i].pid;
            var figElem = document.createElement('figure');            
            var imgElem = document.createElement('img');
            imgElem.src = "./img/kejangcon/loading.gif";
            tryImages(imgElem, resultDatas[i].group_id, imgName);
            var figCaptionElem = document.createElement('figcaption');
            figCaptionElem.textContent = '케장콘 ' + resultDatas[i].group_id;
            figElem.appendChild(imgElem);
            figElem.appendChild(figCaptionElem);
            search_result_table.appendChild(figElem);
        }
    }, false);
}

function tryImages(img, group_id, name) {
    img.src = "./img/kejangcon/" + group_id + "/" + name + ".jpg";
    img.onerror = function() {
        img.src = "./img/kejangcon/" + group_id + "/" + name + ".png";
        img.onerror = function() {
            img.src = "./img/kejangcon/" + group_id + "/" + name + ".gif";
            img.onerror = function(){
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
