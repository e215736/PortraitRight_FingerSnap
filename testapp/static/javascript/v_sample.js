/*
動画処理用のjs
#sample.jsをそのままパクってきた
*/

// ページのリロード時にブラウザのスクロール位置の記憶を無効にする
history.scrollRestoration = 'manual';

// DOMが完全に読み込まれたときに最上部にスクロールする
document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo(0, 0); // スクロール位置をページの最上部に設定
    checkOption(); // 既存の関数を呼び出し
});

// ロゴ画像の要素を取得する
var backButton = document.getElementById('backButton');
// ロゴ画像のクリックイベントにリスナーを登録する
backButton.addEventListener('click', function() {
    var returnHTML = 'https://finger-snap.st.ie.u-ryukyu.ac.jp/';
    // ページをリダイレクト
    window.location.href = returnHTML;
});

// ファイル選択の要素を取得する
var fileBox = document.getElementById("video_data");
// ファイル選択のイベントハンドラとしてcheckOption()を登録する
fileBox.addEventListener("change", checkOption);

function showFileName() {
    // ファイル選択要素を取得する
    var fileBox = document.getElementById("video_data");
    // ファイル名表示要素を取得する
    var fileName = document.getElementById("filename");
    // エラーメッセージを表示する要素を取得する
    var errorMessage = document.getElementById("error_message");
    // 選択されたファイルを取得する
    var file = fileBox.files[0];
    // ファイル名を表示する
    fileName.textContent = file.name;
    // エラーメッセージを初期化する
    errorMessage.textContent = "";
    // 選択されたファイルのURLを作成する
    var fileURL = URL.createObjectURL(file);
    // 動画要素を作成する
    var video = document.createElement("video");
    // 動画要素にURLを設定する
    video.src = fileURL;
    // 動画要素のメタデータが読み込まれたら
    video.addEventListener("loadedmetadata", function() {
        // 動画の秒数を取得する
        var duration = video.duration;
        // 動画の秒数が15秒を超えているかどうか判定する
        if (duration > 16) {
            // エラーメッセージを表示する
            errorMessage.textContent = "この動画は"+duration+"秒です。15秒以内の動画を選択してください。";
            // ファイル選択要素の値を空にする
            fileBox.value = "";
            // ファイル名表示要素の内容を変更する
            fileName.textContent = "選択されていません";
        }
    });
}

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

// 選択されたオプションとタイプとライブラリに基づいて、適切なフォームを表示または非表示にする関数
function checkOption() {
    var option = document.querySelector("input[name='option']:checked").value;
    var target = document.querySelector("input[name='target']:checked").value;

    if (option == "blur") {
        document.getElementById("target_form").style.display = "none";
        // process_formとlibrary_formを表示する
        document.getElementById("target_form").style.display = "block";
        if (target == "body") {
            document.getElementById("balloonE").style.display = "none";
            document.getElementById("balloonF").style.display = "block";
            document.getElementById("balloonG").style.display = "none";
        }
        if (target == "background") {
            document.getElementById("balloonE").style.display = "none";
            document.getElementById("balloonF").style.display = "none";
            document.getElementById("balloonG").style.display = "block";
        }
        if (target == "face") {
            document.getElementById("balloonE").style.display = "block";
            document.getElementById("balloonF").style.display = "none";
            document.getElementById("balloonG").style.display = "none";
        }
    } else {
        document.getElementById("target_form").style.display = "none";
    }
    if (option == "stamp") {
        showStampForm(); // スタンプ用の画像を選択するフォームを表示する
    } else {
        hideStampForm();
    }
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='option']");
for (var i = 0; i < radios.length; i++) {
    radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='target']");
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
  
function closeBox() {
    document.querySelector('.box2').style.display = 'none';
    document.querySelector('.close-btn').style.display = 'none';
}
