＃開発者へのメモ＃
###以下は.gitignoreを記述してpush
testapp/static/
- files
- stamp
- videos

以下を記載。
``````````
*
!.gitignore

``````````

###音あり動画加工実装のためのインストール

`pip install moviepy`

使用モデル一覧:
-yolov8l_100e.pt
-yolov8x-seg.pt

###SVGのホバー動作がミスりやすい気がするので注意

