from flask import Flask, jsonify, request
import json
import secrets

app = Flask(__name__)

@app.route('/quote', methods=['GET', 'POST'])
def handleQuote():
  print('hey man')
  # Check http method is a post
  if request.method == 'POST':
    # Parse posted data into json object
    data = request.get_json()
    print('data')
    print(data)
    response = jsonify({ 'quote': 50.0, 'cryptokey': secrets.token_hex(32) })
    response.status_code = 200
    return response
  elif request.method == 'GET':
    response = jsonify({ 'quote': 100.0, 'cryptokey': secrets.token_hex(32) })
    response.cryptokey = secrets.token_hex(32)
    response.status_code = 200
    return response


if __name__ == '__main__':
  app.run(port=3001, debug=True)