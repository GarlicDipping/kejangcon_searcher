function setup() {
    input.addEventListener("keyup", function () {
        var val = input.value.trim();

        if (!val) {
            search_result_text.innerHTML = '<p>검색 결과가 업구요...ㅎ</p>';
            return;
        }
        var regex = createFuzzyMatcher(val);
        var resultDatas = kejangcon_data.filter(function (row) {
            return regex.test(row["tags"]);
        });
        search_result_text.innerHTML = "<p>검색 결과: " + resultDatas.length + "</p>";
    }, false);
}

var input;
var search_result_text;
(function (window, document, undefined) {

    // code that should be taken care of right away

    window.onload = init;

    function init() {
        // the code to be called when the dom has loaded
        // #document has its nodes
        input = document.getElementById("search_input");
        search_result_text = document.getElementById("search_result_text");

        setup();
    }

})(window, document, undefined);
