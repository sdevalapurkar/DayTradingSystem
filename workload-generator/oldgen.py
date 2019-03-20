import sys
import requests
import re
import time

lines = [line.rstrip('\n') for line in open(sys.argv[1])]
lines = [re.sub(']\s', '],', line) for line in lines]

count = 0

for line in lines:
  count += 1
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
    try:
        price = float(commands[3])
    except:
        price = 150.0
    command_dict.update({
      'userID': commands[1],
      'symbol': commands[2],
      'price': price
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
  try:
    r = requests.post("http://localhost:8123/{}".format(command_type.lower()), json=command_dict, timeout=0.0000001)
  except:
      pass
  print (count)
  time.sleep(0.005)
