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

// ロゴ画像の要素を取得する
var backButton = document.getElementById('backButton');
// ロゴ画像のクリックイベントにリスナーを登録する
backButton.addEventListener('click', function() {
    var returnHTML = 'https://finger-snap.st.ie.u-ryukyu.ac.jp/';
    // ページをリダイレクト
    window.location.href = returnHTML;
});
