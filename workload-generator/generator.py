import requests
import re

lines = [line.rstrip('\n') for line in open('1_user.txt')]
lines = [re.sub('^[[0-9]*]\s', '', line) for line in lines]

for line in lines:
  print(line)
  commands = [command.strip() for command in line.split(',')]
  command_type = commands.pop(0)

  # GET
  if command_type == 'QUOTE':
    r = requests.get('http://localhost:8009/api/{}?user_id={}&stock_symbol={}'.format(command_type, commands[0], commands[1]))
  elif command_type == 'DISPLAY_SUMMARY':
    r = requests.get('http://localhost:8009/api/{}?user_id={}'.format(command_type, commands[0]))
  elif command_type == 'DUMPLOG' and len(commands) == 2:
    r = requests.get('http://localhost:8009/api/{}?user_id={}&filename={}'.format(command_type, commands[0], commands[1]))
  elif command_type == 'DUMPLOG' and len(commands) == 1:
    r = requests.get('http://localhost:8009/api/{}?filename={}'.format(command_type, commands[0]))

  # PUT
  elif command_type == 'ADD':
    command_dict = {
      'user_id': commands[0],
      'amount': commands[1]
    }
    print(command_dict)
    r = requests.put('http://localhost:8009/api/{}'.format(command_type), data=command_dict)

  # POST
  else:
    if command_type in ('BUY', 'SELL', 'SET_BUY_AMOUNT', 'SET_BUY_TRIGGER', 'SET_SELL_AMOUNT', 'SET_SELL_TRIGGER'):
      command_dict = {
        'user_id': commands[0],
        'stock_symbol': commands[1],
        'amount': commands[2]
      }
    elif command_type in ('CANCEL_SET_BUY', 'CANCEL_SET_SELL'):
      command_dict = {
        'user_id': commands[0],
        'stock_symbol': commands[1]
      }
    elif command_type in ('COMMIT_BUY', 'CANCEL_BUY', 'COMMIT_SELL', 'CANCEL_SELL'):
      command_dict = {
        'user_id': commands[0],
      }
    r = requests.post('http://localhost:8009/api/{}'.format(command_type), data=command_dict)

