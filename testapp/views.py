from flask import render_template, request
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
    faces = detector(img)
    option = request.form.get('option')
    if option == 'mosaic':
        for face in faces:
            x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
            face_img = img[y1:y2, x1:x2]
            face_img = cv2.resize(face_img, (10, 10))
            face_img = cv2.resize(face_img, (x2-x1, y2-y1), interpolation=cv2.INTER_NEAREST)
            img[y1:y2, x1:x2] = face_img
    elif option == 'blur':
        for face in faces:
            x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
            face_img = img[y1:y2, x1:x2]
            face_img = cv2.blur(face_img, (30, 30))
            img[y1:y2, x1:x2] = face_img
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
        for face in faces:
            x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
            face_img = img[y1:y2, x1:x2]
            stamp_resized = cv2.resize(stamp, (x2-x1, y2-y1))
            stamp_mask = stamp_resized[:, :, 3]
            stamp_mask_inv = cv2.bitwise_not(stamp_mask)
            stamp_resized = stamp_resized[:, :, :3]
            face_bg = cv2.bitwise_and(face_img, face_img, mask=stamp_mask_inv)
            face_fg = cv2.bitwise_and(stamp_resized, stamp_resized, mask=stamp_mask)
            face_img = cv2.add(face_bg, face_fg)
            img[y1:y2, x1:x2] = face_img
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
    #     for face in faces:
    #         x1, y1, x2, y2 = face.left(), face.top(), face.right(), face.bottom()
    #         face_img = img[y1:y2, x1:x2]
    #         stamp_resized = cv2.resize(stamp, (x2-x1, y2-y1))
    #         stamp_mask = stamp_resized[:, :, 3]
    #         stamp_mask_inv = cv2.bitwise_not(stamp_mask)
    #         stamp_resized = stamp_resized[:, :, :3]
    #         face_bg = cv2.bitwise_and(face_img, face_img, mask=stamp_mask_inv)
    #         face_fg = cv2.bitwise_and(stamp_resized, stamp_resized, mask=stamp_mask)
    #         face_img = cv2.add(face_bg, face_fg)
    #         img[y1:y2, x1:x2] = face_img
    cv2.imwrite('testapp/static/down/processed_' + filename, img)
    return render_template('htmls/processed.html', original=filename, processed='processed_' + filename)
