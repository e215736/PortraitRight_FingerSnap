# ベースイメージはPython 3.10
FROM python:3.10

# 作業ディレクトリを設定
WORKDIR /app

# requirements.txtをコピー
COPY requirements.txt .

# Pythonの依存関係をインストール
RUN pip install --upgrade pip==23.3.1
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get update && apt-get install libgl1-mesa-glx -y

# アプリのコードをコピー
COPY . .

# Flaskのポートを公開
EXPOSE 5572

# サーバーを起動
CMD ["python3", "server.py"]
