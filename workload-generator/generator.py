import sys
import requests
import re

lines = [line.rstrip('\n') for line in open(sys.argv[1])]
lines = [re.sub(']\s', '],', line) for line in lines]

for line in lines:
  commands = [command.strip() for command in line.split(',')]
  command_type = commands.pop(1)

  # GET
  if command_type == 'QUOTE':
    r = requests.get('http://localhost:8123/api/{}?transaction_num={}&user_id={}&stock_symbol={}'.format(command_type, commands[0], commands[1], commands[2]))
  elif command_type == 'DISPLAY_SUMMARY':
    r = requests.get('http://localhost:8123/api/{}?transaction_num={}&user_id={}'.format(command_type, commands[0], commands[1]))
  elif command_type == 'DUMPLOG' and len(commands) == 3:
    r = requests.get('http://localhost:8123/api/{}?transaction_num={}&user_id={}&filename={}'.format(command_type, commands[0], commands[1], commands[2]))
  elif command_type == 'DUMPLOG' and len(commands) == 2:
    r = requests.get('http://localhost:8123/api/{}?transaction_num={}&filename={}'.format(command_type, commands[0], commands[1]))

  else:
    command_dict = {
      'transaction_num': commands[0][1:-1],
      'user_id': commands[1]
    }
    # PUT
    if command_type == 'ADD':
      command_dict.update({
        'amount': commands[2]
      })
      r = requests.put('http://localhost:8123/api/{}'.format(command_type), data=command_dict)

    # POST
    else:
      if command_type in ('BUY', 'SELL', 'SET_BUY_AMOUNT', 'SET_BUY_TRIGGER', 'SET_SELL_AMOUNT', 'SET_SELL_TRIGGER'):
        command_dict.update({
          'stock_symbol': commands[2],
          'amount': commands[3]
        })
      elif command_type in ('CANCEL_SET_BUY', 'CANCEL_SET_SELL'):
        command_dict.update({
          'user_id': commands[1],
          'stock_symbol': commands[2]
        })
      #elif command_type in ('COMMIT_BUY', 'CANCEL_BUY', 'COMMIT_SELL', 'CANCEL_SELL'):

      r = requests.post('http://localhost:8123/api/{}'.format(command_type), data=command_dict)

  print(r.text)
