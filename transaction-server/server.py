from flask import Flask, jsonify, request
app = Flask(__name__)
from crate import client
import json

c = ''

# Add funds to account
@app.route('/add', methods=['GET', 'POST'])
def addHandler():
    # Check http method is a post
    if request.method == 'POST':
        # Parse posted data into json object
        data = request.get_json()
        # Insert new user if they don't already exist, otherwise update their balance
        query_string = 'INSERT INTO users (user_id, balance) VALUES ({1}, {0}) ON CONFLICT (user_id) DO UPDATE SET balance = balance + {0};'

        try:
            c.execute(query_string.format(data['amount'], data['user_id']))
        except:
            return 404

        response = jsonify(success=True)
        response.status_code = 200
        return response
    else:
        return 404


@app.route('/quote')
def quoteHandler():
    pass

@app.route('/buy')
def buyHandler():
    pass

@app.route('/commit_buy')
def commitBuyHandler():
    pass

@app.route('/cancel_buy')
def cancelBuyHandler():
    pass

@app.route('/sell')
def sellHandler():
    pass

@app.route('/commit_sell')
def commitSellHandler():
    pass

@app.route('/cancel_sell')
def cancelSellHandler():
    pass

@app.route('/set_buy_amount')
def setBuyAmountHandler():
    pass

@app.route('/cancel_set_buy')
def cancelSetBuyHandler():
    pass

@app.route('/set_buy_trigger')
def setBuyTriggerHandler():
    pass

@app.route('/set_sell_amount')
def setSellAmountHandler():
    pass

@app.route('/set_sell_trigger')
def setSellTriggerHandler():
    pass

@app.route('/cancel_set_sell')
def cancelSetSellHandler():
    pass

@app.route('/dumplog')
def dumpLogHandler():
    pass

@app.route('/display_summary')
def displaySummaryHandler():
    pass

if __name__ == '__main__':
    connection = client.connect("localhost:4200", username="crate")
    c = connection.cursor()

    app.run(port=3000, debug=True)

