// スタンプ用の画像を選択するフォームを表示する関数
function showStampForm() {
    var stamp_form = document.getElementById("stamp_form");
    stamp_form.style.display = "block";
}
  
// スタンプ用の画像を選択するフォームを非表示にする関数
function hideStampForm() {
    var stamp_form = document.getElementById("stamp_form");
    stamp_form.style.display = "none";
}
  
// ラジオボタンの値に応じてスタンプ用の画像を選択するフォームを表示または非表示にする関数
function checkOption() {
    var option = document.querySelector("input[name='option']:checked").value;
    if (option == "stamp") {
        showStampForm();
    } else {
        hideStampForm();
    }
}
  
// ページが読み込まれたときにラジオボタンの値をチェックする
window.onload = function () {
    checkOption();
};
  
// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='option']");
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", checkOption);
}
  