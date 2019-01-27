from flask import Flast
app = Flask(__name__)



@app.route('/add')
def addHandler()

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