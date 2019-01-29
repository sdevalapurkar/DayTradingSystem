import requests
from crate import client
import time

URL_ROOT = 'http://localhost:8080'


# connection = client.connect("192.168.99.100:4200", username="crate")
# c = connection.cursor()


def test_add():

    data = {
        'userID': '69',
        'balance': 420
    }

    r = requests.post(URL_ROOT + '/add', json=data)

    # time.sleep(2)

    # connection = client.connect("localhost:4200", username="crate")
    # c = connection.cursor()
    # c.execute('SELECT * FROM USERS;')
    # print (c.fetchall())


def test_buy():
    data = {
        'userID': '69',
        'amount': 400,
        'symbol': 'abe'
    }

    r = requests.post(URL_ROOT + '/buy', json=data)


def test_commit_buy():
    data = {
        'userID': '69'
    }

    r = requests.post(URL_ROOT + '/commit_buy', json=data)

def test_cancel_buy():
    data = {
        'userID': '69'
    }

    r = requests.post(URL_ROOT + '/cancel_buy', json=data)


def test_sell():
    data = {
        'userID': '69',
        'amount': 300,
        'symbol': 'abc'
    }

    r = requests.post(URL_ROOT + '/sell', json=data)


def test_commit_sell():
    data = {
        'userID': '69'
    }
    
    r = requests.post(URL_ROOT + '/commit_sell', json=data)


def test_set_buy_amount():
    data = {
        'userID': '69',
        'amount': 200,
        'symbol': 'abc'
    }

    r = requests.post(URL_ROOT + '/set_buy_amount', json=data)

def test_set_sell_amount():
    data = {
        'userID': '69',
        'amount': 200,
        'symbol': 'abc'
    }

    r = requests.post(URL_ROOT + '/set_sell_amount', json=data)

if __name__ == '__main__':
    
    #test_add()
    #test_buy()
    #test_commit_buy()
    #test_sell()
    #test_commit_sell()
    #test_cancel_buy()
    #test_set_buy_amount()
    test_set_sell_amount()
