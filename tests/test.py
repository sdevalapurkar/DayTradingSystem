import unittest
import requests
import time
import re
from crate import client

URL_ROOT = 'http://localhost:8080'

class TestTransactionServer(unittest.TestCase):

    def setUp(self):
        self.connection = client.connect("http://localhost:4200", username="crate")
        self.c = self.connection.cursor()
        self.symbol = 'abc'
        self.user = 'User1'
        data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=data)
        self.quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)
        print('quote is: ', self.quote)
        

    def test_0_add(self):
        data = {
          'userID': self.user,
          'amount': self.quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM users WHERE user_id=?;", (self.user,))
        self.assertEqual(c.fetchone(), [self.quote*2, self.user])

    def test_1_buy(self):
        data = {
          'userID': self.user,
          'amount': self.quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)
        c = self.connection.cursor()
        c.execute("SELECT * FROM users WHERE user_id=?;", (self.user,))
        self.assertEqual(c.fetchone(), [self.quote, self.user])


    def test_2_commit_buy(self):
        data = {
            'userID': self.user,
            'transactionNum': 3
        }
        requests.post(URL_ROOT + '/commit_buy', json=data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=?;", (self.user,))
        self.assertEqual(c.fetchone(), [1, self.symbol, self.user])

    def test_cancel_buy(self):
        data = {
          'userID': self.user,
          'amount': self.quote,
          'symbol': self.symbol,
          'transactionNum': 4
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(1)
        r = requests.post(URL_ROOT + '/cancel_buy', json=data)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=?;", (self.user,))
        self.assertEqual(c.fetchone(), [1, self.symbol, self.user])


    def test_sell(self):
        data = {
            'userID': self.user,
            'amount': self.quote,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/sell', json=data)


    def test_commit_sell(self):
        data = {
            'userID': self.user
        }
        r = requests.post(URL_ROOT + '/commit_sell', json=data)


    def test_cancel_sell(self):
        data = {
            'userID': self.user,
            'amount': self.quote,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/sell', json=data)
        time.sleep(1)
        r = requests.post(URL_ROOT + '/cancel_sell', json=data)


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


#    def tearDownClass(self):
#        self.c.execute('DELETE FROM users;')
#        self.c.execute('DELETE FROM stocks;')
#        self.connection.close()

if __name__ == '__main__':
  unittest.main(warnings='ignore')
