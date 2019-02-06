#!/usr/bin/env python3
import sys
import requests
import re
import time
import json
import threading

if len(sys.argv) != 2:
    print("usage: ./generator.py <inputfile>")
    sys.exit(2)

num_threads = 8

def send_requests(*tasks):
    for task in tasks:
        send_request(task)

def send_request(line):
    line = re.sub(']\s', '],', line)
    print(line)
    commands = [command.strip() for command in line.split(',')]
    command_type = commands.pop(1)

    command_dict = {
      'transactionNum': int(commands[0][1:-1]),
    }
    if command_type == 'ADD':
      command_dict.update({
        'userID': commands[1],
        'amount': float(commands[2])
      })
    elif command_type in ('BUY', 'SELL', 'SET_BUY_AMOUNT', 'SET_SELL_AMOUNT'):
      command_dict.update({
        'userID': commands[1],
        'symbol': commands[2],
        'amount': float(commands[3])
      })
    elif command_type in ('SET_BUY_TRIGGER', 'SET_SELL_TRIGGER'):
      command_dict.update({
        'userID': commands[1],
        'symbol': commands[2],
        'price': float(commands[3])
      })
    elif command_type in ('QUOTE', 'CANCEL_SET_BUY', 'CANCEL_SET_SELL'):
      command_dict.update({
        'userID': commands[1],
        'symbol': commands[2]
      })
    elif command_type in ('COMMIT_BUY', 'CANCEL_BUY', 'COMMIT_SELL', 'CANCEL_SELL', 'DISPLAY_SUMMARY'):
      command_dict.update({
        'userID': commands[1]
    })
    elif command_type == 'DUMPLOG' and len(commands) == 3:
      command_dict.update({
        'userID': commands[1],
        'filename': commands[2]
      })
    elif command_type == 'DUMPLOG' and len(commands) == 2:
      command_dict.update({
        'filename': commands[1]
      })
    print(command_dict)
    r = requests.post('http://localhost:8009/{}'.format(command_type), json=command_dict)
    print(r.text)

try:
    lines = [line.rstrip('\n') for line in open(sys.argv[1])]
    step = int(len(lines)/num_threads)+1
    print(len(lines), step)
    tasks = []
    for i in range(0, num_threads):
        tasks.append(lines[step*i:step*(i+1)])

    threads = []

    print(num_threads, len(lines))
    for i in range(num_threads):
        t = threading.Thread(target=send_requests, args=tuple(tasks[i]))
        t.start()
        threads.append(t)

    for t in threads:
        t.join()

except IOError as err:
    print("I/O error: {}".format(err))
    sys.exit(2)

