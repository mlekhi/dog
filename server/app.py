from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/test-flask')
def test_flask():
    data = {'message': 'Hello from Flask!'}
    return jsonify(data)

@app.route('/transcribe', methods=['POST'])
def transcribe():
    if not request.json or 'transcript' not in request.json:
        return jsonify({'error': 'Missing or invalid JSON data'}), 400

    text = request.json['transcript']
    print(f"Transcript received: {text}")

    if text == "":
        return jsonify({'error': 'Missing "transcript" parameter'}), 400

    return jsonify({'transcript': text})

if __name__ == '__main__':
    app.run(debug=True)
