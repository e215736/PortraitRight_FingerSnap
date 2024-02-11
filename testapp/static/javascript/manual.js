// 手動処理画面で処理したい画像の部分を範囲選択するための変数と関数

// 画像の要素を取得する
var original = document.getElementById("filename");
// 画像の上に重ねるキャンバスを作成する
var canvas = document.createElement("canvas");
// キャンバスのコンテキストを取得する
var ctx = canvas.getContext("2d");
// キャンバスを画像の下に挿入する
original.parentNode.insertBefore(canvas, original.nextSibling);
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
// 画像のサイズを保存する変数
var width, height;

// ページが読み込まれたときに画像のサイズを取得し、キャンバスの位置とサイズを設定する
window.onload = function () {
    // 画像のサイズを取得する（naturalWidthやnaturalHeightを使う）
    width = original.naturalWidth;
    height = original.naturalHeight;
    // キャンバスのサイズを設定する
    canvas.width = width;
    canvas.height = height;
    // キャンバスのスタイルを設定する（positionやtopやleftを画像と一致させる）
    canvas.style.position = "absolute";
    canvas.style.top = original.offsetTop + "px";
    canvas.style.left = original.offsetLeft + "px";
    canvas.style.cursor = "crosshair";
};

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
    // キャンバスに描画する色と線の太さを設定する
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    // ドラッグ開始時の座標と現在の座標から矩形の幅と高さを計算する
    var w = mouseX - startX;
    var h = mouseY - startY;
    // 矩形を描画する
    ctx.strokeRect(startX, startY, w, h);
    // 保存されたバウンディングボックスを再描画
    drawFaces();
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
    var x1 = Math.min(Math.max(startX,0), Math.max(endX,0));
    var y1 = Math.min(Math.max(startY,0), Math.max(endY,0));
    var x2 = Math.max(Math.min(startX,width), Math.min(endX,width));
    var y2 = Math.max(Math.min(startY,height), Math.min(endY,height));
    // 矩形の座標を配列に追加する
    faces.push([x1, y1, x2, y2]);
    // 隠しフィールドに配列を文字列に変換してセットする
    var facesInput = document.getElementById("faces");
    facesInput.value = JSON.stringify(faces);
    ctx.clearRect(0, 0, width, height);
    // 保存されたバウンディングボックスを再描画
    drawFaces();
}

// 保存されたバウンディングボックスを描画する関数
function drawFaces() {
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;
    for (var i = 0; i < faces.length; i++) {
        var face = faces[i];
        ctx.strokeRect(face[0], face[1], face[2] - face[0], face[3] - face[1]);
    }
}


// キャンバスにマウスイベントのリスナーを登録する
canvas.addEventListener("mousemove", drag);
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("mouseout", endDrag);

// ロゴ画像の要素を取得する
var backButton = document.getElementById('backButton');
// ロゴ画像のクリックイベントにリスナーを登録する
backButton.addEventListener('click', function() {
    var returnHTML = 'https://finger-snap.st.ie.u-ryukyu.ac.jp/';
    // ページをリダイレクト
    window.location.href = returnHTML;
});

// ドラッグ操作中に画面の端にマウスがきた場合にその方向に画面をスクロールする関数
function scrollOnDrag(e) {
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    updateMousePosition(e);
    // マウスが画面の端にあるかどうかを判定する
    var edgeOffsetX = window.innerWidth*0.1; // マウスが画面の端からどれだけ離れているとスクロールするか
    var edgeOffsetY = window.innerHeight*0.1; // マウスが画面の端からどれだけ離れているとスクロールするか
    var isNearRightEdge = window.innerWidth - e.clientX < edgeOffsetX;
    var isNearLeftEdge = e.clientX < edgeOffsetX;
    var isNearTopEdge = e.clientY < edgeOffsetY;
    var isNearBottomEdge = window.innerHeight - e.clientY < edgeOffsetY;
    // スクロールの速度を設定する
    var scrollSpeedX = window.innerWidth*0.1;
    var scrollSpeedY = window.innerHeight*0.1;
    // マウスが画面の端にある場合にその方向にスクロールする
    if (isNearRightEdge) {
        window.scrollBy(scrollSpeedX, 0);
    } else if (isNearLeftEdge) {
        window.scrollBy(-scrollSpeedX, 0);
    }
    if (isNearBottomEdge) {
        window.scrollBy(0, scrollSpeedY);
    } else if (isNearTopEdge) {
        window.scrollBy(0, -scrollSpeedY);
    }
}

// マウス移動イベントにスクロール関数を追加する
window.addEventListener("mousemove", scrollOnDrag);


// モード切替ボタンの要素を取得する
var modeButton = document.getElementById("modeButton");
// 現在のモードを保存する変数（初期値は範囲選択モード）
var mode = "selection";

// モード切替ボタンがクリックされたときにモードを切り替える関数
function switchMode() {
    if (mode === "selection") {
        // 現在が範囲選択モードの場合、スクロールモードに切り替える
        mode = "scroll";
        modeButton.textContent = "範囲選択モードへ";
        canvas.style.pointerEvents = "none"; // キャンバスのイベントを無効にする
    } else {
        // 現在がスクロールモードの場合、範囲選択モードに切り替える
        mode = "selection";
        modeButton.textContent = "スクロールモードへ";
        canvas.style.pointerEvents = "auto"; // キャンバスのイベントを有効にする
    }
}

// モード切替ボタンにクリックイベントのリスナーを登録する
modeButton.addEventListener("click", switchMode);

// キャンバスにマウスが乗ったときにマウスの座標を更新する関数
function touchupdateMousePosition(e) {
    // キャンバスの左上からの相対座標に変換する
    var rect = e.target.getBoundingClientRect();
    mouseX = e.changedTouches[0].clientX - rect.left;
    mouseY = e.changedTouches[0].clientY - rect.top;
}

// キャンバスでマウスを押したときにドラッグ開始時の座標を保存する関数
function touchstartDrag(e) {
    // マウスの座標を更新する
    touchupdateMousePosition(e);
    // ドラッグ開始時の座標を保存する
    startX = mouseX;
    startY = mouseY;
    // ドラッグ中のフラグを立てる
    isDragging = true;
}

// キャンバスでマウスを動かしたときにドラッグ中の範囲を描画する関数
function touchdrag(e) {
    e.preventDefault(); // スクロールを防ぐ
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    touchupdateMousePosition(e);
    // キャンバスをクリアする
    ctx.clearRect(0, 0, width, height);
    // キャンバスに描画する色と線の太さを設定する
    ctx.strokeStyle = "red";
    ctx.lineWidth = 3;    // ドラッグ開始時の座標と現在の座標から矩形の幅と高さを計算する
    var w = mouseX - startX;
    var h = mouseY - startY;
    // 矩形を描画する
    ctx.strokeRect(startX, startY, w, h);
    // 保存されたバウンディングボックスを再描画
    drawFaces();
}

// キャンバスでマウスを離したときにドラッグ終了時の座標を保存する関数
function touchendDrag(e) {
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    touchupdateMousePosition(e);
    // ドラッグ終了時の座標を保存する
    var endX = mouseX;
    var endY = mouseY;
    // ドラッグ中のフラグを下ろす
    isDragging = false;
    // ドラッグ開始時と終了時の座標から矩形の左上と右下の座標を計算する
    var x1 = Math.min(Math.max(startX,0), Math.max(endX,0));
    var y1 = Math.min(Math.max(startY,0), Math.max(endY,0));
    var x2 = Math.max(Math.min(startX,width), Math.min(endX,width));
    var y2 = Math.max(Math.min(startY,height), Math.min(endY,height));
    // 矩形の座標を配列に追加する
    faces.push([x1, y1, x2, y2]);
    // 隠しフィールドに配列を文字列に変換してセットする
    var facesInput = document.getElementById("faces");
    facesInput.value = JSON.stringify(faces);
    ctx.clearRect(0, 0, width, height);
    // 保存されたバウンディングボックスを再描画
    drawFaces();
}

canvas.addEventListener("touchmove", touchdrag);
canvas.addEventListener("touchstart", touchstartDrag);
canvas.addEventListener("touchend", touchendDrag);
canvas.addEventListener("touchend", touchendDrag);

// ドラッグ操作中に画面の端にマウスがきた場合にその方向に画面をスクロールする関数
function touchscrollOnDrag(e) {
    // ドラッグ中でなければ何もしない
    if (!isDragging) return;
    // マウスの座標を更新する
    touchupdateMousePosition(e);
    // マウスが画面の端にあるかどうかを判定する
    var edgeOffsetX = window.innerWidth*0.1; // マウスが画面の端からどれだけ離れているとスクロールするか
    var edgeOffsetY = window.innerHeight*0.1; // マウスが画面の端からどれだけ離れているとスクロールするか
    var isNearRightEdge = window.innerWidth - e.changedTouches[0].clientX < edgeOffsetX;
    var isNearLeftEdge = e.changedTouches[0].clientX < edgeOffsetX;
    var isNearTopEdge = e.changedTouches[0].clientY < edgeOffsetY;
    var isNearBottomEdge = window.innerHeight - e.changedTouches[0].clientY < edgeOffsetY;
    // スクロールの速度を設定する
    var scrollSpeedX = window.innerWidth*0.1;
    var scrollSpeedY = window.innerHeight*0.1;
    // マウスが画面の端にある場合にその方向にスクロールする
    if (isNearRightEdge) {
        window.scrollBy(scrollSpeedX, 0);
    } else if (isNearLeftEdge) {
        window.scrollBy(-scrollSpeedX, 0);
    }
    if (isNearBottomEdge) {
        window.scrollBy(0, scrollSpeedY);
    } else if (isNearTopEdge) {
        window.scrollBy(0, -scrollSpeedY);
    }
}

// マウス移動イベントにスクロール関数を追加する
window.addEventListener("touchmove", touchscrollOnDrag);


function closeBox() {
    document.querySelector('.box2').style.display = 'none';
    document.querySelector('.close-btn').style.display = 'none';
}
