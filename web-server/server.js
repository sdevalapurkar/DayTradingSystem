const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const app = express();
const port = 8123;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.get('/api/QUOTE', function(req, res) {
  console.log('web server received QUOTE')
  console.log(req.query);
  rp({
    method: 'POST',
    uri: `http://localhost:8080/api/QUOTE`,
    body: {
      'userID': '123',
      'symbol': 'heyyy',
    },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from get');
});

app.put('/api/ADD', function(req, res) {
  console.log('Add endpoint');
  console.log(req.body.amount);
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'PUT',
      uri: 'http://localhost:8080/api/ADD',
      body: req.body,
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey from put')
  }
});

app.post('/api/BUY', function(req, res) {
  console.log('Buy endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: 'http://localhost:8080/api/BUY',
      body: req.body,
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey from put')
  }
});

app.post('/api/COMMIT_BUY', function(req, res) {
  console.log('Commit Buy endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/COMMIT_BUY',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/CANCEL_BUY', function(req, res) {
  console.log('Cancel buy endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/CANCEL_BUY',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/SELL', function(req, res) {
  console.log('Sell endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: 'http://localhost:8080/api/SELL',
      body: req.body,
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey from put')
  }
});

app.post('/api/COMMIT_SELL', function(req, res) {
  console.log('Commit sell endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/COMMIT_SELL',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/CANCEL_SELL', function(req, res) {
  console.log('Cancel sell endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/CANCEL_SELL',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/SET_BUY_AMOUNT', function(req, res) {
  console.log('Set buy amount endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: 'http://localhost:8080/api/SET_BUY_AMOUNT',
      body: req.body,
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey from put')
  }
});

app.post('/api/CANCEL_SET_BUY', function(req, res) {
  console.log('Cancel set buy endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/CANCEL_SET_BUY',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/SET_BUY_TRIGGER', function(req, res) {
  console.log('Set sell trigger endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/SET_BUY_TRIGGER',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/SET_SELL_AMOUNT', function(req, res) {
  console.log('Set sell amount endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: 'http://localhost:8080/api/SET_SELL_AMOUNT',
      body: req.body,
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey from put')
  }
});

app.post('/api/SET_SELL_TRIGGER', function(req, res) {
  console.log('Set sell trigger endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/SET_SELL_TRIGGER',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.post('/api/CANCEL_SET_SELL', function(req, res) {
  console.log('Cancel set sell endpoint');
  rp({
    method: 'POST',
    uri: 'http://localhost:8080/api/CANCEL_SET_SELL',
    body: req.body,
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.get('/api/DUMPLOG', function(req, res) {
  console.log('Dumplog endpoint');
  rp({
    uri: `http://localhost:8080/api/DUMPLOG?${req.originalUrl}`
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.get('/api/DISPLAY_SUMMARY', function(req, res) {
  console.log('Display summary endpoint');
  rp({
    uri: `http://localhost:8080/api/DISPLAY_SUMMARY?${req.originalUrl}`
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey from put')
});

app.listen(port);
