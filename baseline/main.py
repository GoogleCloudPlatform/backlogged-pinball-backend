from flask import Flask

app = Flask(__name__)


@app.route('/', methods=["POST"])
def receive_push_messages():
    return "OK", 200
