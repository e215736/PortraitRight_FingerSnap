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

// デフォルトのスタンプの画像をクリックしたときに選択されたことを示す関数
function selectStamp(e) {
  // クリックした画像の要素を取得する
  var target = e.target;
  // 画像のファイル名を取得する
  var stamp_name = target.alt;
  // 隠しフィールドにファイル名をセットする
  var default_stamp = document.getElementById("default_stamp");
  default_stamp.value = stamp_name;
  // すべてのデフォルトのスタンプの画像の枠線を消す
  var stamps = document.getElementsByClassName("default_stamp");
  for (var i = 0; i < stamps.length; i++) {
      stamps[i].style.border = "none";
  }
  // クリックした画像の枠線を赤くする
  target.style.border = "5px solid red";
}

// デフォルトのスタンプの画像にクリックイベントを追加する
var stamps = document.getElementsByClassName("default_stamp");
for (var i = 0; i < stamps.length; i++) {
  stamps[i].addEventListener("click", selectStamp);
}

// スタンプの要素を取得する
var stamp = document.querySelector("input[name=stamp]");
// ラジオボタンの要素を取得する
var radio = document.querySelectorAll("input[name=option]");
// ラジオボタンの変更イベントにリスナーを登録する
radio.forEach(function(r) {
r.addEventListener("change", function() {
  // スタンプが選択された場合はrequired属性を付ける
  if (r.value == "stamp") {
    stamp.required = true;
  } else {
    // それ以外の場合はrequired属性を外す
    stamp.required = false;
  }
});
});

// デフォルトスタンプの画像要素を取得する
var default_stamps = document.querySelectorAll(".default_stamp");
// デフォルトスタンプのクリックイベントにリスナーを登録する
default_stamps.forEach(function(ds) {
ds.addEventListener("click", function() {
  // クリックされたデフォルトスタンプのファイル名を取得する
  var stamp_name = ds.alt;
  // 隠しフィールドにファイル名をセットする
  default_stamps.value = stamp_name;
  // スタンプのrequired属性を外す
  stamp.required = false;
});
}); 
