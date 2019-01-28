const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8009;

app.use(bodyParser.json());

app.get('/api/QUOTE', function(req, res) {
  console.log(req.query)
  console.log('hey we are hitting the get endpoint!!');
  res.send('hey')
});

app.put('/api/ADD', function(req, res) {
  console.log(req.body);
  console.log('hey we are hitting the post endpoint');
  res.send('hey')
});

app.listen(port);
