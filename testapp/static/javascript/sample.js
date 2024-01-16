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
  var type = document.querySelector("input[name='type']:checked").value;
  var library = document.querySelector("input[name='library']:checked").value;
  var library2 = document.querySelector("input[name='library2']:checked").value;
  var target = document.querySelector("input[name='target']:checked").value;
  var target2 = document.querySelector("input[name='target2']:checked").value;

  // ファイルの数を取得する
  var fileCount = document.getElementById("image_data").files.length;

  // ファイルの数に応じてフォームを表示または非表示にする
  if (fileCount >= 2) {
    // process_formとlibrary_formを非表示にする
    document.getElementById("process_form").style.display = "none";
    document.getElementById("target_form").style.display = "none";
    document.getElementById("target_form2").style.display = "none";
    document.getElementById("library_form").style.display = "none";
    document.getElementById("library_form2").style.display = "none";
    if (option == "blur") {
      document.getElementById("target_form2").style.display = "block";
      if (target2 == "body") {
        //balloonBを表示させる
        document.getElementById("balloonE2").style.display = "none";
        document.getElementById("balloonF2").style.display = "block";
        document.getElementById("balloonG2").style.display = "none";
      }
      if (target2 == "background") {
        //balloonBを表示させる
        document.getElementById("balloonE2").style.display = "none";
        document.getElementById("balloonF2").style.display = "none";
        document.getElementById("balloonG2").style.display = "block";
      }
      if (target2 == "face") {
        //balloonBを表示させる
        document.getElementById("balloonE2").style.display = "block";
        document.getElementById("balloonF2").style.display = "none";
        document.getElementById("balloonG2").style.display = "none";
      }
    } else {
      document.getElementById("target_form2").style.display = "none";
    }
  } else {
    // process_formとlibrary_formを表示する
    document.getElementById("process_form").style.display = "block";
    document.getElementById("target_form").style.display = "block";
    document.getElementById("library_form").style.display = "block";
    document.getElementById("library_form2").style.display = "block";
    if (option == "blur") {
      document.getElementById("target_form").style.display = "block";
      document.getElementById("library_form").style.display = "none";
      document.getElementById("library_form2").style.display = "block";
      if (type == "manual") {
        //balloonBを表示させる
        document.getElementById("balloonB").style.display = "block";
        //balloonAを表示させない
        document.getElementById("balloonA").style.display = "none";
        // process_formとlibrary_formを非表示にする
        document.getElementById("target_form").style.display = "none";
        document.getElementById("library_form").style.display = "none";
        document.getElementById("library_form2").style.display = "none";
      } else {
        //balloonAを表示させる
        document.getElementById("balloonA").style.display = "block";
        //balloonBを表示させない
        document.getElementById("balloonB").style.display = "none";
        // process_formとlibrary_formを表示する
        document.getElementById("target_form").style.display = "block";
        document.getElementById("library_form").style.display = "none";
        document.getElementById("library_form2").style.display = "block";
        if (target == "body") {
          //balloonBを表示させる
          document.getElementById("balloonE").style.display = "none";
          document.getElementById("balloonF").style.display = "block";
          document.getElementById("balloonG").style.display = "none";
          document.getElementById("library_form").style.display = "none";
          document.getElementById("library_form2").style.display = "none";
        }
        if (target == "background") {
          //balloonBを表示させる
          document.getElementById("balloonE").style.display = "none";
          document.getElementById("balloonF").style.display = "none";
          document.getElementById("balloonG").style.display = "block";
          document.getElementById("library_form").style.display = "none";
          document.getElementById("library_form2").style.display = "none";
        }
        if (target == "face") {
          //balloonBを表示させる
          document.getElementById("balloonE").style.display = "block";
          document.getElementById("balloonF").style.display = "none";
          document.getElementById("balloonG").style.display = "none";
          document.getElementById("library_form").style.display = "none";
          document.getElementById("library_form2").style.display = "block";
          if (library2 == "dlib") {
            //balloonCを表示させる
            document.getElementById("balloonC2").style.display = "block";
            //balloonDを表示させない
            document.getElementById("balloonD2").style.display = "none";
          }
          if (library2 == "yolov8") {
            //balloonCを表示させる
            document.getElementById("balloonD2").style.display = "block";
            //balloonDを表示させない
            document.getElementById("balloonC2").style.display = "none";
          }
        }
      }
    } else {
      document.getElementById("target_form").style.display = "none";
      document.getElementById("target_form2").style.display = "none";
      document.getElementById("library_form2").style.display = "none";
      document.getElementById("library_form").style.display = "block";
      if (type == "manual") {
        //balloonBを表示させる
        document.getElementById("balloonB").style.display = "block";
        //balloonAを表示させない
        document.getElementById("balloonA").style.display = "none";
        // process_formとlibrary_formを非表示にする
        document.getElementById("library_form2").style.display = "none";
        document.getElementById("library_form").style.display = "none";
      } else {
        //balloonAを表示させる
        document.getElementById("balloonA").style.display = "block";
        //balloonBを表示させない
        document.getElementById("balloonB").style.display = "none";
        // process_formとlibrary_formを非表示にする
        document.getElementById("library_form2").style.display = "none";
        document.getElementById("library_form").style.display = "block";
        if (library == "dlib") {
          //balloonCを表示させる
          document.getElementById("balloonC").style.display = "block";
          //balloonDを表示させない
          document.getElementById("balloonD").style.display = "none";
        }
        if (library == "yolov8") {
          //balloonCを表示させる
          document.getElementById("balloonD").style.display = "block";
          //balloonDを表示させない
          document.getElementById("balloonC").style.display = "none";
        }
      }
    }
  }
  if (option == "stamp") {
    showStampForm(); // スタンプ用の画像を選択するフォームを表示する
  } else {
    hideStampForm();
  }
}

// ページのリロード時にブラウザのスクロール位置の記憶を無効にする
history.scrollRestoration = 'manual';

// DOMが完全に読み込まれたときに最上部にスクロールする
document.addEventListener('DOMContentLoaded', function () {
  window.scrollTo(0, 0); // スクロール位置をページの最上部に設定
  checkOption(); // 既存の関数を呼び出し
});

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='option']");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='type']");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='library']");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='library2']");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='target']");
for (var i = 0; i < radios.length; i++) {
  radios[i].addEventListener("change", checkOption);
}

// ラジオボタンが変更されたときにラジオボタンの値をチェックする
var radios = document.querySelectorAll("input[name='target2']");
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

// ロゴ画像の要素を取得する
var backButton = document.getElementById('backButton');
// ロゴ画像のクリックイベントにリスナーを登録する
backButton.addEventListener('click', function() {
    var returnHTML = 'http://finger-snap.st.ie.u-ryukyu.ac.jp/';
    // ページをリダイレクト
    window.location.href = returnHTML;
});

// ファイル選択の要素を取得する
var fileBox = document.getElementById("image_data");
// ファイル選択のイベントハンドラとしてcheckOption()を登録する
fileBox.addEventListener("change", checkOption);

// アップロードできるファイルの最大数を定義する
var maxFileCount = 10;

// 選択されたファイルの数や名前を表示する関数
function showFileName() {
  // ファイル選択要素を取得する
  var fileBox = document.getElementById("image_data");
  // ファイル名表示要素を取得する
  var fileName = document.getElementById("filename");
  // エラーメッセージを表示する要素を取得する
  var errorMessage = document.getElementById("error_message");
  // 選択されたファイルの数を取得する
  var fileCount = fileBox.files.length;
  // ファイルの数が最大数を超えていたらエラーメッセージを表示する
  if (fileCount > maxFileCount) {
    // エラーメッセージを表示する要素の内容を変更する
    errorMessage.textContent = "アップロードできるファイルは" + maxFileCount + "個までです。";
    // ファイル選択要素の値を空にする
    fileBox.value = "";
    // ファイル名表示要素の内容を変更する
    fileName.textContent = "選択されていません";
  } else if (fileCount == 0) {
    // ファイルの数に応じてファイル名表示要素の内容を変更する
    // ファイルが選択されていない場合はメッセージを表示する
    fileName.textContent = "選択されていません";
    errorMessage.textContent = "";
  } else if (fileCount == 1) {
    // ファイルが1つ選択されている場合はそのファイル名を表示する
    fileName.textContent = fileBox.files[0].name;
    errorMessage.textContent = "";
  } else {
    // ファイルが複数選択されている場合はファイルの数を表示する
    // もしくは、全てのファイル名を改行で区切って表示する
    // fileName.textContent = fileCount + "個の画像が選択されました";
    var fileNames = "";
    for (var i = 0; i < fileCount; i++) {
      fileNames += fileBox.files[i].name + "\n";
    }
    fileName.textContent = fileNames;
    errorMessage.textContent = "";
  }
}