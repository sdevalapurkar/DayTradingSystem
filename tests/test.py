import unittest
import requests
import time
from crate import client

URL_ROOT = 'http://localhost:8080'

class TestTransactionServer(unittest.TestCase):

    def setUp(self):
        self.connection = client.connect("http://localhost:4200", username="crate")
        self.c = self.connection.cursor()

    def test_add(self):
        data = {
          'userID': 'User1',
          'amount': 100.00,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=data)
        time.sleep(1)
        self.c.execute('SELECT * FROM USERS;')
        self.assertEqual(self.c.fetchone(), [100.0, 'User1'])


#   def test_buy(self):
#       data = {
#           'userID': '69',
#           'amount': 400,
#           'symbol': 'abe'
#       }
#       r = requests.post(URL_ROOT + '/buy', json=data)


#   def test_commit_buy(self):
#       data = {
#           'userID': '69'
#       }
#       r = requests.post(URL_ROOT + '/commit_buy', json=data)


#   def test_cancel_buy(self):
#       data = {
#           'userID': '69'
#       }
#       r = requests.post(URL_ROOT + '/cancel_buy', json=data)


#   def test_sell(self):
#       data = {
#           'userID': '69',
#           'amount': 300,
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/sell', json=data)


#   def test_commit_sell(self):
#       data = {
#           'userID': '69'
#       }
#       r = requests.post(URL_ROOT + '/commit_sell', json=data)


#   def test_cancel_sell(self):
#       data = {
#           'userID': '69'
#       }
#       r = requests.post(URL_ROOT + '/cancel_sell', json=data)


#   def test_set_buy_amount(self):
#       data = {
#           'userID': '69',
#           'amount': 200,
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/set_buy_amount', json=data)


#   def test_set_sell_amount(self):
#       data = {
#           'userID': '69',
#           'amount': 200,
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/set_sell_amount', json=data)


#   def test_cancel_set_buy(self):
#       data = {
#           'userID': '69',
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/cancel_set_buy', json=data)


#   def test_set_buy_trigger(self):
#       data = {
#           'userID': '69',
#           'symbol': 'abc',
#           'price': 69
#       }
#       r = requests.post(URL_ROOT + '/set_buy_trigger', json=data)


#   def test_set_sell_trigger(self):
#       data = {
#           'userID': '69',
#           'symbol': 'abc',
#           'price': 69
#       }
#       r = requests.post(URL_ROOT + '/set_sell_trigger', json=data)


#   def test_cancel_set_sell(self):
#       data = {
#           'userID': '69',
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/cancel_set_sell', json=data)


#   def test_user_dumplog(self):
#       data = {
#           'userID': '69',
#           'filename': 'user_dumplog'
#       }
#       r = requests.post(URL_ROOT + '/dumplog', json=data)


#   def test_system_dumplog(self):
#       data = {
#           'filename': 'system_dumplog',
#       }
#       r = requests.post(URL_ROOT + '/dumplog', json=data)


#   def test_display_summary(self):
#       data = {
#           'userID': '69'
#       }
#       r = requests.post(URL_ROOT + '/display_summary', json=data)


#   def test_quote_handler(self):
#       data = {
#           'userID': '69',
#           'symbol': 'abc'
#       }
#       r = requests.post(URL_ROOT + '/quote', json=data)

    def tearDown(self):
        self.c.execute('DELETE FROM USERS;')


if __name__ == '__main__':
  unittest.main()
