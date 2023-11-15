// 手動処理画面で処理したい画像の部分を範囲選択するための変数と関数

// 画像の要素を取得する
var original = document.getElementById("original");
// 画像のサイズを取得する
var width = original.width;
var height = original.height;
// 画像の上に重ねるキャンバスを作成する
var canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
// キャンバスのコンテキストを取得する
var ctx = canvas.getContext("2d");
// キャンバスを画像の下に挿入する
original.parentNode.insertBefore(canvas, original.nextSibling);
// キャンバスのスタイルを設定する
canvas.style.position = "absolute";
canvas.style.top = original.offsetTop + "px";
canvas.style.left = original.offsetLeft + "px";
canvas.style.cursor = "crosshair";
// キャンバスに描画する色と線の太さを設定する
ctx.strokeStyle = "red";
ctx.lineWidth = 5;
// マウスの座標を保存する変数
var mouseX = 0;
var mouseY = 0;
// ドラッグ開始時の座標を保存する変数
var startX = 0;
var startY = 0;
// ドラッグ中かどうかを判定する変数
var isDragging = false;
// 選択した範囲の座標を保存する配列
var faces = [];

// キャンバスにマウスが乗ったときにマウスの座標を更新する関数
function updateMousePosition(e) {
    // キャンバスの左上からの相対座標に変換する
    var rect = e.target.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
}

// キャンバスでマウスを押したときにドラッグ開始時の座標を保存する関数
function startDrag(e) {
    // マウスの座標を更新する
    updateMousePosition(e);
    // ドラッグ開始時の座標を保存する
    startX = mouseX;
    startY = mouseY;
    // ドラッグ中のフラグを立てる
    isDragging = true;
}

// キャンバスでマウスを動かしたときにドラッグ中の範囲を描画する関数
function drag(e) {
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    updateMousePosition(e);
    // キャンバスをクリアする
    ctx.clearRect(0, 0, width, height);
    // ドラッグ開始時の座標と現在の座標から矩形の幅と高さを計算する
    var w = mouseX - startX;
    var h = mouseY - startY;
    // 矩形を描画する
    ctx.strokeRect(startX, startY, w, h);
}

// キャンバスでマウスを離したときにドラッグ終了時の座標を保存する関数
function endDrag(e) {
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    updateMousePosition(e);
    // ドラッグ終了時の座標を保存する
    var endX = mouseX;
    var endY = mouseY;
    // ドラッグ中のフラグを下ろす
    isDragging = false;
    // ドラッグ開始時と終了時の座標から矩形の左上と右下の座標を計算する
    var x1 = Math.min(startX, endX);
    var y1 = Math.min(startY, endY);
    var x2 = Math.max(startX, endX);
    var y2 = Math.max(startY, endY);
    // 矩形の座標を配列に追加する
    faces.push([x1, y1, x2, y2]);
    // 隠しフィールドに配列を文字列に変換してセットする
    var facesInput = document.getElementById("faces");
    facesInput.value = JSON.stringify(faces);
}

// キャンバスにマウスイベントのリスナーを登録する
canvas.addEventListener("mousemove", drag);
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("mouseout", endDrag);

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
