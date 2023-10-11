from flask import render_template  # 追加
from testapp import app


@app.route('/')
def index():
    return render_template('testapp/index.html')