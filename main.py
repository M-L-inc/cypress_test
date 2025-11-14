from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, template_folder='templates', static_folder='templates/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('templates/static', path)

if __name__ == '__main__':
    print("Server running at http://localhost:3000")
    app.run(host='0.0.0.0', port=3000, debug=True)
