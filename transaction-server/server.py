from flask import Flast, jsonify
app = Flask(__name__)
from crate import client
import json

c = ''

@app.route('/add')
def addHandler():
    if request.method == 'POST':
        data = request.get_json()
        query_string = 'UPDATE users SET balance = balance + {} where user_id = {}'
        c.execute(query_string.format(data['amount'], data['user_id']))

        response = jsonify(success=True)
        response.status_code = 200
    else:
        return 404


@app.route('/quote')
def quateHandler()

@app.route('/buy')
def buyHandler()

@app.route('/commit_buy')
def commitBuyHandler()

@app.route('/cancel_buy')
def cancelBuyHandler()

@app.route('/sell')
def sellHandler()

@app.route('/commit_sell')
def commitSellHandler()

@app.route('/cancel_sell')
def cancelSellHandler()

@app.route('/set_buy_amount')
def setBuyAmountHandler()

@app.route('/cancel_set_buy')
def cancelSetBuyHandler()

@app.route('/set_buy_trigger')
def setBuyTriggerHandler()

@app.route('/set_sell_amount')
def setSellAmountHandler()

@app.route('/set_sell_trigger')
def setSellTriggerHandler()

@app.route('/cancel_set_sell')
def cancelSetSellHandler()

@app.route('/dumplog')
def dumpLogHandler()

@app.route('/display_summary')
def displaySummaryHandler()

if __name__ == '__main__':
    app.run()
    connection = client.connect("localhost:4200", username="crate")
    c = connection.cursor()

