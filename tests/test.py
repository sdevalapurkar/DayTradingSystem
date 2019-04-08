import unittest
import requests
import time
import re
import psycopg2

URL_ROOT = 'http://localhost:8080'

class TestTransactionServer(unittest.TestCase):

    def setUp(self):
        self.connection = psycopg2.connect(host="127.0.0.1", port="5432", user="postgres", database="postgres")
        self.symbol = 'abc'
        self.user = 'User1'
        self.balance = 0
        data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=data)
        self.quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

    def tearDown(self):
        c = self.connection.cursor()
        c.execute('DELETE FROM users;')
        c.execute('DELETE FROM stocks;')
        c.execute('DELETE FROM buy_amounts;')
        c.execute('DELETE FROM sell_amounts;')
        c.execute('DELETE FROM triggers;')
        self.connection.commit()
        c.close()
        self.connection.close()


    def test_0_add(self):
        data = {
          'userID': self.user,
          'amount': self.quote*2,
          'transactionNum': 1
        }

        requests.post(URL_ROOT + '/add', json=data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM users WHERE user_id=%s;", (self.user,)) 
        self.assertEqual(c.fetchone(), (self.user, self.quote*2,)) 


    def test_1_buy(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        c = self.connection.cursor()

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)
        c.execute("SELECT * FROM users WHERE user_id=%s;", (self.user,))
        result = list(c.fetchone())

        self.assertEqual(result[0], (self.user))
        self.assertEqual(round(result[1], 2), (cash_quote))


    def test_2_commit_buy(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)

        commitbuy_data = {
            'userID': self.user,
            'transactionNum': 3
        }
        requests.post(URL_ROOT + '/commit_buy', json=commitbuy_data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=%s;", (self.user,))
        self.assertEqual(c.fetchone(), (self.user, self.symbol, 1))

    def test_cancel_buy(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)

        cancel_data = {
          'userID': self.user,
          'transactionNum': 3
        }
        r = requests.post(URL_ROOT + '/cancel_buy', json=cancel_data)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=%s;", (self.user,))
        self.assertEqual(c.fetchone(), None)


    def test_sell(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)

        r = requests.post(URL_ROOT + '/sell', json=data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), None)


    def test_commit_sell(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)

        r = requests.post(URL_ROOT + '/sell', json=data)
        time.sleep(1)

        commitsell_data = {
            'userID': self.user,
        }
        r = requests.post(URL_ROOT + '/commit_sell', json=commitsell_data)
        time.sleep(1)
        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), None)


    def test_cancel_sell(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
          'userID': self.user,
          'amount': cash_quote,
          'symbol': self.symbol,
          'transactionNum': 2
        }
        requests.post(URL_ROOT + '/buy', json=data)
        time.sleep(2)

        r = requests.post(URL_ROOT + '/sell', json=data)
        time.sleep(1)

        cancelsell_data = {
            'userID': self.user,
            'amount': self.quote,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/cancel_sell', json=cancelsell_data)

        c = self.connection.cursor()
        c.execute("SELECT * FROM stocks WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (self.user, self.symbol, 1))


    def test_set_buy_amount(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_buy_amount', json=data)

        c = self.connection.cursor()
        c.execute("SELECT quantity FROM buy_amounts WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (cash_quote,))


    def test_set_sell_amount(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_sell_amount', json=data)

        c = self.connection.cursor()
        c.execute("SELECT quantity FROM sell_amounts WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (cash_quote,))


    def test_cancel_set_buy(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_buy_amount', json=data)

        cancel_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/cancel_set_buy', json=cancel_data)

        c = self.connection.cursor()
        c.execute("SELECT quantity FROM buy_amounts WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), None)


    def test_set_buy_trigger(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_buy_amount', json=data)

        trigger_data = {
            'userID': self.user,
            'symbol': self.symbol,
            'price': cash_quote
        }
        r = requests.post(URL_ROOT + '/set_buy_trigger', json=trigger_data)

        c = self.connection.cursor()
        c.execute("SELECT price FROM triggers WHERE user_id=%s and symbol=%s and method='buy';", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (cash_quote,))


    def test_set_sell_trigger(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_sell_amount', json=data)

        trigger_data = {
            'userID': self.user,
            'symbol': self.symbol,
            'price': cash_quote
        }
        r = requests.post(URL_ROOT + '/set_sell_trigger', json=trigger_data)

        c = self.connection.cursor()
        c.execute("SELECT price FROM triggers WHERE user_id=%s and symbol=%s and method='sell';", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (cash_quote,))


    def test_cancel_set_sell(self):
        quote_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/quote', json=quote_data)
        cash_quote = round(float(re.search(r'.*?,.*?,(.*?)$', r.text).group(1)), 2)

        add_data = {
          'userID': self.user,
          'amount': cash_quote*2,
          'transactionNum': 1
        }
        requests.post(URL_ROOT + '/add', json=add_data)
        time.sleep(1)

        data = {
            'userID': self.user,
            'amount': cash_quote,
            'symbol': self.symbol,
        }
        r = requests.post(URL_ROOT + '/set_sell_amount', json=data)

        trigger_data = {
            'userID': self.user,
            'symbol': self.symbol,
            'price': cash_quote
        }
        r = requests.post(URL_ROOT + '/set_sell_trigger', json=trigger_data)

        c = self.connection.cursor()
        c.execute("SELECT price FROM triggers WHERE user_id=%s and symbol=%s and method='sell';", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), (cash_quote,))

        cancel_data = {
            'userID': self.user,
            'symbol': self.symbol
        }
        r = requests.post(URL_ROOT + '/cancel_set_sell', json=cancel_data)

        c.execute("SELECT price FROM triggers WHERE user_id=%s and symbol=%s and method='sell';", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), None)

        c.execute("SELECT quantity FROM sell_amounts WHERE user_id=%s and symbol=%s;", (self.user,self.symbol))
        self.assertEqual(c.fetchone(), None)


if __name__ == '__main__':
  unittest.main(warnings='ignore')
