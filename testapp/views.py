from flask import render_template, request, redirect, url_for
from testapp import app
import numpy as np
import cv2
import dlib
import os
import time
import datetime

detector = dlib.get_frontal_face_detector()

# デフォルトのスタンプのファイル名のリストを作成する
# (デフォルトスタンプを追加・変更・削除する場合サーバを再度立ち上げる)
# もしくは、@app.route('/') def index(): この中にコードを移動する
default_stamps = os.listdir('testapp/static/default_stamp')

def mosaic_process(faces, img):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        face_img = img[y1:y2, x1:x2]
        height, width, channels = face_img.shape
        if (height == 0) or (width == 0):
            continue
        if height >= width:
            mos = height/width
            face_img = cv2.resize(face_img, (8, int(8*mos)))
        else:
            mos = width/height
            face_img = cv2.resize(face_img, (int(8*mos), 8))
        #face_img = cv2.resize(face_img, (8, 8))
        face_img = cv2.resize(face_img, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
        img[y1:y2, x1:x2] = face_img
        
def blur_process(faces, img):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        face_img = img[y1:y2, x1:x2]
        height, width, channels = face_img.shape
        if (height == 0) or (width == 0):
            continue
        #face_img = cv2.blur(face_img, (30, 30))
        face_img = cv2.blur(face_img, (int(width/5), int(height/5)))
        img[y1:y2, x1:x2] = face_img
        
def stamp_process(faces, img, stamp, stamp_filename):
    height, width, channels = img.shape
    for face in faces:
        stamp0 = stamp
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        if (y2-y1 == 0) or (x2-x1 == 0):
            continue
        x = (x2-x1)/2
        y = (y2-y1)/2
        if stamp_filename == "bittu.png":
            y_zure = (y2-y1)*(6/9)
            y1 -= int(y_zure)
            y2 -= int(y_zure)
        if stamp_filename == "bittu2.png":
            y_zure = (y2-y1)*(10/22)
            x_zure = (x2-x1)*(5/30)
            x1 += int(x_zure)
            x2 += int(x_zure)
            y1 -= int(y_zure)
            y2 -= int(y_zure)
        x1 -= int(x)
        y1 -= int(y)
        x2 += int(x)
        y2 += int(y)
        stamp_resized = cv2.resize(stamp0, (x2-x1, y2-y1)) # スタンプのサイズ変更
        x10 = 0
        x20 = 0
        y10 = 0
        y20 = 0
        if x1 < 0:
            x10 = 0-x1
            x1 = 0
        if y1 < 0:
            y10 = 0-y1
            y1 = 0
        if x2 > width:
            x20 = x2-width
            x2 = width
        if y2 > height:
            y20 = y2-height
            y2 = height
        face_img = img[y1:y2, x1:x2]
        height2, width2, channels = stamp_resized.shape
        stamp_resized = stamp_resized[y10:height2-y20, x10:width2-x20] # スタンプのはみ出た部分をカット
        stamp_mask = stamp_resized[:, :, 3]
        stamp_mask_inv = cv2.bitwise_not(stamp_mask)
        stamp_resized = stamp_resized[:, :, :3]
        face_bg = cv2.bitwise_and(face_img, face_img, mask=stamp_mask_inv)
        face_fg = cv2.bitwise_and(stamp_resized, stamp_resized, mask=stamp_mask)
        face_img = cv2.add(face_bg, face_fg)
        img[y1:y2, x1:x2] = face_img
        
def stamp_process2(faces, img, stamp, stamp_filename):
    height, width, channels = img.shape
    for face in faces:
        stamp0 = stamp
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        if (y2-y1 == 0) or (x2-x1 == 0):
            continue
        stamp_resized = cv2.resize(stamp0, (x2-x1, y2-y1)) # スタンプのサイズ変更
        x10 = 0
        x20 = 0
        y10 = 0
        y20 = 0
        if x1 < 0:
            x10 = 0-x1
            x1 = 0
        if y1 < 0:
            y10 = 0-y1
            y1 = 0
        if x2 > width:
            x20 = x2-width
            x2 = width
        if y2 > height:
            y20 = y2-height
            y2 = height
        height2, width2, channels = stamp_resized.shape
        stamp_resized = stamp_resized[y10:height2-y20, x10:width2-x20] # スタンプのはみ出た部分をカット
        img[y1:y2, x1:x2] = stamp_resized

# 手動でモザイクなどの処理した部分を元に戻す関数を追加
def rest_process(faces, img, original):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        if (y2-y1 == 0) or (x2-x1 == 0):
            continue
        img[y1:y2, x1:x2] = original[y1:y2, x1:x2]

from ultralytics import YOLO
model = YOLO(model="yolov8l_100e.pt")
def yol(filename, model):
    results = model.predict(source='testapp/static/files/' + filename)
    result = results[0]
    bodys = []
    for xyxy in result.boxes.xyxy:
        body = []
        body.append(xyxy[0])
        body.append(xyxy[1])
        body.append(xyxy[2])
        body.append(xyxy[3])
        bodys.append(body)
    return bodys

@app.route('/')
def index():
    # 画像ファイルが保存されているディレクトリのパス
    image_dirs = ['testapp/static/files/', 'testapp/static/stamp/']
    # 現在の日時を取得
    now = datetime.datetime.now()
    # リスト内の各ディレクトリに対してループ
    for image_dir in image_dirs:
        # ディレクトリ内の画像ファイルを走査
        for filename in os.listdir(image_dir):
            # 画像ファイルのフルパスを作成
            filepath = os.path.join(image_dir, filename)
            # 画像ファイルの更新日時を取得
            mtime = os.path.getmtime(filepath)
            # 更新日時をdatetimeオブジェクトに変換
            mtime = datetime.datetime.fromtimestamp(mtime)
            # 現在の日時との差分を計算
            diff = now - mtime
            # 差分が1時間以上なら画像ファイルを削除
            if diff > datetime.timedelta(hours=1):
            #if diff > datetime.timedelta(seconds=30):
                os.remove(filepath)
    return render_template('htmls/index.html', default_stamps=default_stamps)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if not file:
        return 'ファイルがありません'
    filename = file.filename
    original = file.filename
    file.save('testapp/static/files/' + filename)
    img = cv2.imread('testapp/static/files/' + filename)
    option = request.form.get('option')
    type = request.form.get('type')
    library = request.form.get('library') # フォームから処理ライブラリの値を取得する
    if type == 'auto':
        if library == 'dlib': # dlibの場合
            faces0 = detector(img) # dlibで顔の検出を行う
            faces = []
            for face0 in faces0:
                face = []
                face.append(face0.left())
                face.append(face0.top())
                face.append(face0.right())
                face.append(face0.bottom())
                faces.append(face)
        elif library == 'yolov8': # yolov8の場合
            faces = yol(filename, model) # yolov8で顔の検出を行う
    elif type == 'manual':
        if option == 'stamp':
            # フォームからスタンプの画像を取得する
            stamp_file = request.files['stamp']
            # 隠しフィールドからデフォルトのスタンプのファイル名を取得する
            default_stamp = request.form.get('default_stamp')
            # どちらかがあれば処理を続ける
            if stamp_file or default_stamp:
                # フォームからスタンプの画像があればそれを使う
                if stamp_file:
                    stamp_filename = stamp_file.filename
                    stamp_filename = str(time.time()) + '_' + stamp_filename
                    stamp_file.save('testapp/static/stamp/' + stamp_filename)
                    stamp_type = "file"
                # フォームからスタンプの画像がなければデフォルトのスタンプを使う
                else:
                    stamp_filename = default_stamp
                    stamp_type = "default"
                return redirect(url_for('manual', original=original, filename=filename, option=option, stamp=stamp_filename, stamp_type=stamp_type)) # 手動処理の場合は別の画面に遷移
            else:
                return 'スタンプ用の画像がありません'
        return redirect(url_for('manual', original=original, filename=filename, option=option)) # 手動処理の場合は別の画面に遷移
    if option == 'mosaic':
        mosaic_process(faces, img) # モザイク処理を行う
    elif option == 'blur':
        blur_process(faces, img) # ぼかし処理を行う
    elif option == 'stamp':
        # フォームからスタンプの画像を取得する
        stamp_file = request.files['stamp']
        # 隠しフィールドからデフォルトのスタンプのファイル名を取得する
        default_stamp = request.form.get('default_stamp')
        # どちらかがあれば処理を続ける
        if stamp_file or default_stamp:
            # フォームからスタンプの画像があればそれを使う
            if stamp_file:
                stamp_filename = stamp_file.filename
                stamp_filename = str(time.time()) + '_' + stamp_filename
                stamp_file.save('testapp/static/stamp/' + stamp_filename)
                stamp = cv2.imread('testapp/static/stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
            # フォームからスタンプの画像がなければデフォルトのスタンプを使う
            else:
                stamp_filename = default_stamp
                stamp = cv2.imread('testapp/static/default_stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
        else:
            return 'スタンプ用の画像がありません'
        if stamp.shape[2] == 4:
            stamp_process(faces, img, stamp, stamp_filename) # スタンプ処理を行う
        else:
            stamp_process2(faces, img, stamp, stamp_filename) # スタンプ処理を行う
    #     自分たちで透過処理を行うなら
    #     stamp = cv2.imread('testapp/static/stamp/' + stamp_filename)
    #     # スタンプ画像にアルファチャンネルを追加する
    #     stamp = cv2.cvtColor(stamp, cv2.COLOR_BGR2BGRA)
    #     # スタンプ画像のアルファ値を半分にする
    #     stamp[:, :, 3] = stamp[:, :, 3] // 2
    #     # スタンプ画像の白色を透明色にする
    #     transparence = (255, 255, 255, 255) # 白色のRGBA値
    #     stamp = np.where(stamp == transparence, 0, stamp) # 白色の部分を0にする
    #     stamp_process(faces, img, stamp)
    cv2.imwrite('testapp/static/files/processed_' + filename, img)
    return render_template('htmls/processed.html', original=original, filename=filename, processed='processed_' + filename)

@app.route('/manual')
def manual():
    # 手動処理画面に遷移する
    filename = request.args.get('filename')
    original = request.args.get('original')
    option = request.args.get('option')
    stamp = request.args.get('stamp')
    stamp_type = request.args.get('stamp_type')
    return render_template('htmls/manual.html', original=original, filename=filename, option=option, stamp=stamp, stamp_type=stamp_type)

@app.route('/process', methods=['POST'])
def process():
    # 手動処理画面から送られたデータを受け取る
    filename = request.form.get('filename')
    original = request.form.get('original')
    option = request.form.get('option')
    stamp_filename = request.form.get('stamp')
    stamp_type = request.form.get('stamp_type')
    faces = request.form.get('faces')
    if len(faces) >= 1:
        # facesは文字列なのでリストに変換する
        faces = eval(faces)
    # 画像を読み込む
    img = cv2.imread('testapp/static/files/' + filename)
    # 選択したオプションに応じて処理を行う
    if option == 'mosaic':
        mosaic_process(faces, img)
    elif option == 'blur':
        blur_process(faces, img)
    elif option == 'stamp':
        if stamp_type == "file":
            stamp = cv2.imread('testapp/static/stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
        elif stamp_type == "default":
            stamp = cv2.imread('testapp/static/default_stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
        if stamp.shape[2] == 4:
            stamp_process(faces, img, stamp, stamp_filename) # スタンプ処理を行う
        else:
            stamp_process2(faces, img, stamp, stamp_filename) # スタンプ処理を行う
    # 処理後の画像を保存する
    cv2.imwrite('testapp/static/files/processed_' + filename, img)
    # 処理前後の画像を表示する画面に遷移する
    return render_template('htmls/processed.html', original=original, filename=filename, processed='processed_' + filename)

# 手動でモザイクなどの処理した部分を元に戻すルートを追加
@app.route('/restore')
def restore():
    # 手動でモザイクなどの処理した部分を元に戻す画面に遷移する
    original = request.args.get('original')
    filename = request.args.get('processed')
    return render_template('htmls/restore.html', original=original, filename=filename)

@app.route('/restore_process', methods=['POST'])
def restore_process():
    # 手動でモザイクなどの処理した部分を元に戻す画面から送られたデータを受け取る
    original = request.form.get('original')
    processed = request.form.get('filename')
    faces = request.form.get('faces')
    if len(faces) >= 1:
        # facesは文字列なのでリストに変換する
        faces = eval(faces)
    # 画像を読み込む
    img = cv2.imread('testapp/static/files/' + processed)
    # 加工前の画像も読み込む
    original_ = cv2.imread('testapp/static/files/' + original)
    rest_process(faces, img, original_)
    # 処理後の画像を保存する
    cv2.imwrite('testapp/static/files/processed_' + processed, img)
    # 処理前後の画像を表示する画面に遷移する
    return render_template('htmls/processed.html', original=original, filename=original, processed='processed_' + processed)

# 処理後の画像をさらに処理できるようにするルートを追加
@app.route('/more_manual')
def more_manual():
    # 処理後の画像をさらに処理できるようにする画面に遷移する
    original = request.args.get('original')
    filename = request.args.get('processed')
    return render_template('htmls/more_manual.html', original=original, filename=filename, default_stamps=default_stamps)

# 処理後の画像をさらに処理するルートを追加
@app.route('/more_manual_process', methods=['POST'])
def more_manual_process():
    # 処理後の画像をさらに処理する画面から送られたデータを受け取る
    original = request.form.get('original')
    filename = request.form.get('filename')
    img = cv2.imread('testapp/static/files/' + filename)
    option = request.form.get('option')
    type = request.form.get('type')
    library = request.form.get('library')
    faces = request.form.get('faces')
    if type == 'auto':
        if library == 'dlib': # dlibの場合
            faces0 = detector(img) # dlibで顔の検出を行う
            faces = []
            for face0 in faces0:
                face = []
                face.append(face0.left())
                face.append(face0.top())
                face.append(face0.right())
                face.append(face0.bottom())
                faces.append(face)
        elif library == 'yolov8': # yolov8の場合
            faces = yol(filename, model) # yolov8で顔の検出を行う
    elif type == 'manual':
        if option == 'stamp':
            # フォームからスタンプの画像を取得する
            stamp_file = request.files['stamp']
            # 隠しフィールドからデフォルトのスタンプのファイル名を取得する
            default_stamp = request.form.get('default_stamp')
            # どちらかがあれば処理を続ける
            if stamp_file or default_stamp:
                # フォームからスタンプの画像があればそれを使う
                if stamp_file:
                    stamp_filename = stamp_file.filename
                    stamp_filename = str(time.time()) + '_' + stamp_filename
                    stamp_file.save('testapp/static/stamp/' + stamp_filename)
                    stamp_type = "file"
                # フォームからスタンプの画像がなければデフォルトのスタンプを使う
                else:
                    stamp_filename = default_stamp
                    stamp_type = "default"
                return redirect(url_for('manual', original=original, filename=filename, option=option, stamp=stamp_filename, stamp_type=stamp_type)) # 手動処理の場合は別の画面に遷移
            else:
                return 'スタンプ用の画像がありません'
        return redirect(url_for('manual', original=original, filename=filename, option=option)) # 手動処理の場合は別の画面に遷移
    if option == 'mosaic':
        mosaic_process(faces, img) # モザイク処理を行う
    elif option == 'blur':
        blur_process(faces, img) # ぼかし処理を行う
    elif option == 'stamp':
        # フォームからスタンプの画像を取得する
        stamp_file = request.files['stamp']
        # 隠しフィールドからデフォルトのスタンプのファイル名を取得する
        default_stamp = request.form.get('default_stamp')
        # どちらかがあれば処理を続ける
        if stamp_file or default_stamp:
            # フォームからスタンプの画像があればそれを使う
            if stamp_file:
                stamp_filename = stamp_file.filename
                stamp_filename = str(time.time()) + '_' + stamp_filename
                stamp_file.save('testapp/static/stamp/' + stamp_filename)
                stamp = cv2.imread('testapp/static/stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
            # フォームからスタンプの画像がなければデフォルトのスタンプを使う
            else:
                stamp_filename = default_stamp
                stamp = cv2.imread('testapp/static/default_stamp/' + stamp_filename, cv2.IMREAD_UNCHANGED)
        else:
            return 'スタンプ用の画像がありません'
        if stamp.shape[2] == 4:
            stamp_process(faces, img, stamp, stamp_filename) # スタンプ処理を行う
        else:
            stamp_process2(faces, img, stamp, stamp_filename) # スタンプ処理を行う
    cv2.imwrite('testapp/static/files/processed_' + filename, img)
    return render_template('htmls/processed.html', original=original, filename=filename, processed='processed_' + filename)
