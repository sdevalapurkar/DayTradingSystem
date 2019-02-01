from flask import Flask, jsonify, request
import json

app = Flask(__name__)

@app.route('/quote', methods=['GET', 'POST'])
def handleQuote():
# Check http method is a post
    if request.method == 'POST':
        # Parse posted data into json object
        data = request.get_json()
        response = jsonify(quote=50.0)
        response.status_code = 200
        return response
    elif request.method == 'GET':
        response = jsonify(quote=100.0)
        response.status_code = 200
        return response


if __name__ == '__main__':
    app.run(port=3000, debug=True)