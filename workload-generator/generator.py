import requests
import re

request_type_dict = {
  'ADD': 'POST',
  'QUOTE': 'GET'
}

lines = [line.rstrip('\n') for line in open('1_user.txt')]
lines = [re.sub('^[[0-9]*]\s', '', line) for line in lines]

for line in lines:
  commands = [command.strip() for command in line.split(',')]
  command_type = commands.pop(0)

  request_type = request_type_dict.get(command_type)

  if command_type == 'QUOTE':
    r = requests.get('http://192.168.1.68:8009/api/{}?user_id={}&stock_symbol={}'.format(command_type, commands[0], commands[1]))
  elif command_type == 'ADD':
    command_dict = {
      'user_id': commands[0],
      'amount': commands[1]
    }

    r = requests.put('http://192.168.1.68:8009/api/{}'.format(command_type), data=command_dict)
  elif command_type == 'BUY':
    command_dict = {
      'user_id': commands[0],
      'stock_symbol': commands[1],
      'amount': commands[2]
    }

    r = requests.post('http://192.168.1.68:8009/api/{}'.format(command_type), data=command_dict) 
