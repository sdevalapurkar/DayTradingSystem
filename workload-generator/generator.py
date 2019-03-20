#!/usr/bin/env python3
import sys
import requests
import re
import time
import json
import threading

def send_requests(*tasks):
    for task in tasks:
        send_request(task)
        time.sleep(5)

def send_request(line):
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
    r = requests.post("http://localhost:8123/{}".format(command_type.lower()), json=command_dict)

if len(sys.argv) != 2:
    print("usage: ./generator.py <inputfile>")
    sys.exit(2)

tasks = []
threads = []
user_commands = {}

try:
    lines = [line.rstrip('\n') for line in open(sys.argv[1])]
    count = len(lines)

    for l in range(count):
      line = lines[l]
      line = re.sub("]\s", "],", line)
      commands = [command.strip() for command in line.split(',')]
      user = commands[2]

      if commands[1] == 'DUMPLOG' or l == count-1:
        for user in user_commands:
            t = threading.Thread(target=send_requests, args=tuple(user_commands[user]))
            t.start()
            threads.append(t)

        for t in threads:
            t.join()

        #time.sleep(80000)
        dump_t = threading.Thread(target=send_requests, args=tuple([line]))
        dump_t.start()
        dump_t.join()
        user_commands = {}

      else:
        user_commands[user] = user_commands.get(user, [])
        user_commands[user].append(line)


except IOError as err:
    print("I/O error: {}".format(err))
    sys.exit(2)
