function setup() {
    input.addEventListener("keyup", function () {
        var val = input.value.trim();
        if (!val) {
            //공백, Do nothing
            return;
        }
        var regex = createFuzzyMatcher(val);
        var resultDatas = kejangcon_data.filter(function (row) {
            return regex.test(row["tags"]);
        });
        search_result_text.innerHTML = "<p>" + resultDatas.length + "개 찻앗구...ㅎ</p>";
        var row_count = Math.floor(resultDatas.length / 4) + 1;
        var columnWrappers = [];
        search_result_table.innerHTML = '';
        for(var i = 0; i < row_count; i++){
            columnWrappers[i] = document.createElement('div');
            columnWrappers[i].className = 'column';
            columnWrappers[i].id = 'col_' + i;
            //('<div class="column" id="col_' + i + '"></div>');
            search_result_table.appendChild(columnWrappers[i]);
        }
        for(var i = 0; i < resultDatas.length; i++){
            var row = Math.floor(i / 4);
            var imgName = resultDatas[i].pid;
            var newElem = document.createElement('img');
            newElem.src = "./img/kejangcon/loading.gif";
            newElem.width = 100;
            newElem.height = 100;
            tryImages(newElem, imgName);
            //('<img src="' + imgSrc + '">');
            columnWrappers[row].appendChild(newElem);
        }
    }, false);
}

function tryImages(img, name) {
    img.src = "./img/kejangcon/" + name + ".jpg";
    img.onerror = function() {
        img.src = "./img/kejangcon/" + name + ".png";
        img.onerror = function() {
            img.src = "./img/kejangcon/" + name + ".gif";
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
