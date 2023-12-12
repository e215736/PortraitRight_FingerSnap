// 手動でモザイクなどの処理した部分を元に戻す画面で処理したい画像の部分を範囲選択するための変数と関数

// 画像の要素を取得する
var processed = document.getElementById("processed");
// 画像のサイズを取得する
var width = processed.width;
var height = processed.height;
// 画像の上に重ねるキャンバスを作成する
var canvas = document.createElement("canvas");
canvas.width = width;
canvas.height = height;
// キャンバスのコンテキストを取得する
var ctx = canvas.getContext("2d");
// キャンバスを画像の下に挿入する
processed.parentNode.insertBefore(canvas, processed.nextSibling);
// キャンバスのスタイルを設定する
canvas.style.position = "absolute";
canvas.style.top = processed.offsetTop + "px";
canvas.style.left = processed.offsetLeft + "px";
canvas.style.cursor = "crosshair";
// キャンバスに描画する色と線の太さを設定する
ctx.strokeStyle = "blue";
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

document.getElementById('backButton').addEventListener('click', function() {
    var returnHTML = 'http://finger-snap.st.ie.u-ryukyu.ac.jp/';
    // ページをリダイレクト
    window.location.href = returnHTML;
  });