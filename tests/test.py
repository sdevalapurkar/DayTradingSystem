import requests
from crate import client
import time


connection = client.connect("localhost:4200", username="crate")
c = connection.cursor()


def test_add():

    data = {
        'user_id': 69,
        'amount': 420
    }

    r = requests.post('http://localhost:3000/add', json=data)

    time.sleep(2)

    connection = client.connect("localhost:4200", username="crate")
    c = connection.cursor()
    c.execute('SELECT * FROM USERS;')
    print (c.fetchall())



if __name__ == '__main__':
    
    test_add()