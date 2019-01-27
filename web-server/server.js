const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 8009;

app.use(bodyParser.json());

app.get('/api/QUOTE', function(req, res) {
  console.log(req.query)
  console.log('Quote endpoint');
  res.send('hey from get')
});

app.put('/api/ADD', function(req, res) {
  console.log(req.body);
  console.log('Add endpoint');
  res.send('hey from put')
});

app.post('/api/BUY', function(req, res) {
  console.log(req.body);
  console.log('Buy endpoint');
  res.send('hey from put')
});

app.post('/api/COMMIT_BUY', function(req, res) {
  console.log(req.body);
  console.log('Commit Buy endpoint');
  res.send('hey from put')
});

app.post('/api/CANCEL_BUY', function(req, res) {
  console.log(req.body);
  console.log('Cancel buy endpoint');
  res.send('hey from put')
});

app.post('/api/SELL', function(req, res) {
  console.log(req.body);
  console.log('Sell endpoint');
  res.send('hey from put')
});

app.post('/api/COMMIT_SELL', function(req, res) {
  console.log(req.body);
  console.log('Commit sell endpoint');
  res.send('hey from put')
});

app.post('/api/CANCEL_SELL', function(req, res) {
  console.log(req.body);
  console.log('Cancel sell endpoint');
  res.send('hey from put')
});

app.post('/api/SET_BUY_AMOUNT', function(req, res) {
  console.log(req.body);
  console.log('Set buy amount endpoint');
  res.send('hey from put')
});

app.post('/api/CANCEL_SET_BUY', function(req, res) {
  console.log(req.body);
  console.log('Cancel set buy endpoint');
  res.send('hey from put')
});

app.post('/api/SET_BUY_TRIGGER', function(req, res) {
  console.log(req.body);
  console.log('Set sell trigger endpoint');
  res.send('hey from put')
});

app.post('/api/SET_SELL_AMOUNT', function(req, res) {
  console.log(req.body);
  console.log('Set sell amount endpoint');
  res.send('hey from put')
});

app.post('/api/SET_SELL_TRIGGER', function(req, res) {
  console.log(req.body);
  console.log('Set sell trigger endpoint');
  res.send('hey from put')
});

app.post('/api/CANCEL_SET_SELL', function(req, res) {
  console.log(req.body);
  console.log('Cancel set sell endpoint');
  res.send('hey from put')
});

app.get('/api/DUMPLOG', function(req, res) {
  console.log(req.query);
  console.log('Dumplog endpoint');
  res.send('hey from put')
});

app.get('/api/DISPLAY_SUMMARY', function(req, res) {
  console.log(req.query);
  console.log('Display summary endpoint');
  res.send('hey from put')
});

app.listen(port);
