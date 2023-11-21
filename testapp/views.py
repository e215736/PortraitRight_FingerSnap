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
        x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
        face_img = img[y1:y2, x1:x2]
        face_img = cv2.resize(face_img, (10, 10))
        face_img = cv2.resize(face_img, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
        img[y1:y2, x1:x2] = face_img
        
def blur_process(faces, img):
    for face in faces:
        x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
        face_img = img[y1:y2, x1:x2]
        face_img = cv2.blur(face_img, (30, 30))
        img[y1:y2, x1:x2] = face_img
        
def stamp_process(faces, img, stamp, stamp_filename):
    height, width, channels = img.shape
    for face in faces:
        x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
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
        height2, width2, channels = stamp.shape
        stamp = stamp[y10:height2-y20, x10:width2-x20] # スタンプのはみ出た部分をカット
        stamp_resized = cv2.resize(stamp, (x2-x1, y2-y1)) # スタンプのサイズ変更
        stamp_mask = stamp_resized[:, :, 3]
        stamp_mask_inv = cv2.bitwise_not(stamp_mask)
        stamp_resized = stamp_resized[:, :, :3]
        face_bg = cv2.bitwise_and(face_img, face_img, mask=stamp_mask_inv)
        face_fg = cv2.bitwise_and(stamp_resized, stamp_resized, mask=stamp_mask)
        face_img = cv2.add(face_bg, face_fg)
        img[y1:y2, x1:x2] = face_img

def mosaic_process2(faces, img):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        face_img = img[y1:y2, x1:x2]
        face_img = cv2.resize(face_img, (10, 10))
        face_img = cv2.resize(face_img, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
        img[y1:y2, x1:x2] = face_img
        
def blur_process2(faces, img):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        face_img = img[y1:y2, x1:x2]
        face_img = cv2.blur(face_img, (30, 30))
        img[y1:y2, x1:x2] = face_img
        
def stamp_process2(faces, img, stamp):
    height, width, channels = img.shape
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        x = (x2-x1)/2
        y = (y2-y1)/2
        x1 -= int(x)
        y1 -= int(y)
        x2 += int(x)
        y2 += int(y)
        if x1 < 0:
            x1 = 0
        if y1 < 0:
            y1 = 0
        if x2 > width:
            x1 = width
        if y2 > height:
            y2 = height
        face_img = img[y1:y2, x1:x2]
        stamp_resized = cv2.resize(stamp, (x2-x1, y2-y1))
        stamp_mask = stamp_resized[:, :, 3]
        stamp_mask_inv = cv2.bitwise_not(stamp_mask)
        stamp_resized = stamp_resized[:, :, :3]
        face_bg = cv2.bitwise_and(face_img, face_img, mask=stamp_mask_inv)
        face_fg = cv2.bitwise_and(stamp_resized, stamp_resized, mask=stamp_mask)
        face_img = cv2.add(face_bg, face_fg)
        img[y1:y2, x1:x2] = face_img

# 手動でモザイクなどの処理した部分を元に戻す関数を追加
def restore_process2(faces, img, original):
    for face in faces:
        x1, y1, x2, y2 = int(face[0]), int(face[1]), int(face[2]), int(face[3])
        # 加工前の画像から同じ範囲の部分をコピーする
        face_img = original[y1:y2, x1:x2]
        # 加工後の画像に上書きする
        img[y1:y2, x1:x2] = face_img

@app.route('/')
def index():
    # 画像ファイルが保存されているディレクトリのパス
    image_dirs = ['testapp/static/up/', 'testapp/static/down/', 'testapp/static/stamp/']
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
            #if diff > datetime.timedelta(hours=1):
            if diff > datetime.timedelta(seconds=30):
                os.remove(filepath)
    return render_template('htmls/index.html', default_stamps=default_stamps)

@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    if not file:
        return 'ファイルがありません'
    filename = file.filename
    file.save('testapp/static/up/' + filename)
    img = cv2.imread('testapp/static/up/' + filename)
    option = request.form.get('option')
    type = request.form.get('type')
    if type == 'auto':
        faces = detector(img) # 自動処理の場合
    elif type == 'manual':
        return redirect(url_for('manual', filename=filename, option=option)) # 手動処理の場合は別の画面に遷移
    if option == 'mosaic':
        mosaic_process(faces, img)
    elif option == 'blur':
        blur_process(faces, img)
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
        stamp_process(faces, img, stamp, stamp_filename)
    # elif option == 'stamp':
    #     stamp_file = request.files['stamp']
    #     if not stamp_file:
    #         return 'スタンプ用の画像がありません'
    #     stamp_filename = stamp_file.filename
    #     stamp_file.save('testapp/static/stamp/' + stamp_filename)
    #     stamp = cv2.imread('testapp/static/stamp/' + stamp_filename)
    #     # スタンプ画像にアルファチャンネルを追加する
    #     stamp = cv2.cvtColor(stamp, cv2.COLOR_BGR2BGRA)
    #     # スタンプ画像のアルファ値を半分にする
    #     stamp[:, :, 3] = stamp[:, :, 3] // 2
    #     # スタンプ画像の白色を透明色にする
    #     transparence = (255, 255, 255, 255) # 白色のRGBA値
    #     stamp = np.where(stamp == transparence, 0, stamp) # 白色の部分を0にする
    #     stamp_process(faces, img, stamp)
    cv2.imwrite('testapp/static/down/processed_' + filename, img)
    return render_template('htmls/processed.html', original=filename, processed='processed_' + filename)

@app.route('/manual')
def manual():
    # 手動処理画面に遷移する
    filename = request.args.get('filename')
    option = request.args.get('option')
    print(filename)
    return render_template('htmls/manual.html', filename=filename, option=option)

@app.route('/process', methods=['POST'])
def process():
    # 手動処理画面から送られたデータを受け取る
    filename = request.form.get('filename')
    option = request.form.get('option')
    faces = request.form.get('faces')
    if len(faces) >= 1:
        # facesは文字列なのでリストに変換する
        faces = eval(faces)
    # 画像を読み込む
    img = cv2.imread('testapp/static/up/' + filename)
    # 選択したオプションに応じて処理を行う
    if option == 'mosaic':
        mosaic_process2(faces, img)
    elif option == 'blur':
        blur_process2(faces, img)
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
        stamp_process2(faces, img, stamp)
    # 処理後の画像を保存する
    cv2.imwrite('testapp/static/down/processed_' + filename, img)
    # 処理前後の画像を表示する画面に遷移する
    return render_template('htmls/processed.html', original=filename, processed='processed_' + filename)

# 手動でモザイクなどの処理した部分を元に戻すルートを追加
@app.route('/restore')
def restore():
    # 手動でモザイクなどの処理した部分を元に戻す画面に遷移する
    filename = request.args.get('filename')
    return render_template('htmls/restore.html', filename=filename)

@app.route('/restore_process', methods=['POST'])
def restore_process():
    # 手動でモザイクなどの処理した部分を元に戻す画面から送られたデータを受け取る
    filename = request.form.get('filename')
    faces = request.form.get('faces')
    if len(faces) >= 1:
        # facesは文字列なのでリストに変換する
        faces = eval(faces)
    # 画像を読み込む
    img = cv2.imread('testapp/static/down/processed_' + filename)
    # 加工前の画像も読み込む
    original = cv2.imread('testapp/static/up/' + filename)
    restore_process2(faces, img, original)
    # 処理後の画像を保存する
    cv2.imwrite('testapp/static/down/processed_' + filename, img)
    # 処理前後の画像を表示する画面に遷移する
    return render_template('htmls/processed.html', original=filename, processed='processed_' + filename)