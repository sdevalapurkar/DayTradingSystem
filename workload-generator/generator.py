import requests
import re

lines = [line.rstrip('\n') for line in open('1_user.txt')]
lines = [re.sub('^[[0-9]*]\s', '', line) for line in lines]

for line in lines:
  print(line)
  commands = [command.strip() for command in line.split(',')]
  command_type = commands.pop(0)
  print(commands)

  # only GET
  if command_type == 'QUOTE':
    r = requests.get('http://localhost:8009/api/{}?user_id={}&stock_symbol={}'.format(command_type, commands[0], commands[1]))

  # rest are POST
  else:
    if command_type == 'ADD':
      command_dict = {
        'user_id': commands[0],
        'amount': commands[1]
      }
    elif command_type in ('BUY', 'SELL', 'SET_BUY_AMOUNT', 'SET_BUY_TRIGGER', 'SET_SELL_AMOUNT', 'SET_SELL_TRIGGER'):
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
    elif command_type in ('COMMIT_BUY', 'CANCEL_BUY', 'COMMIT_SELL', 'CANCEL_SELL', 'DISPLAY_SUMMARY'):
      command_dict = {
        'user_id': commands[0],
      }
    elif command_type == 'DUMPLOG':
      if len(commands) == 2:
          command_dict = {
            'user_id': commands[0],
            'filename': commands[1]
          }
      else:
          command_dict = {
            'filename': commands[0]
          }

    print(command_type, command_dict)
    r = requests.put('http://localhost:8009/api/{}'.format(command_type), data=command_dict)

