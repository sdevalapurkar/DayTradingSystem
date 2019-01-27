from flask import Flask, jsonify, request
from crate import client
import json

app = Flask(__name__)

c = ''

# Add funds to account
# Method: POST
# Parameters:
#       user_id:    the id of the user adding funds to their account
#       amount:     (int) the amount of money to add to the user's account
# 
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


# Request a quote for a given stock symbol
# Method: POST
# Parameters:
#       symbol:     three-letter stock symbol to return quote for
#
@app.route('/quote')
def quoteHandler():
    pass

# Returns
def getQuote(ticker):
    return 50

# Performs a buy transaction for a given user on a given stock
# Parameters
@app.route('/buy')
def buyHandler():
    if request.method == 'POST':
        # Parse posted data into json object
        data = request.get_json()
        pps = getQuote(data['symbol'])

    # TODO: get price of stock
    # Calculate total cost
    # Check user has enough funds
    # If they do, buy them
    #       reduce user balance
    #       increase user stock balance
    # If they don't, return 'nah g'
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

