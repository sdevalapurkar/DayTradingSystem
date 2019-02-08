const express = require('express');
const bodyParser = require('body-parser');
const rp = require('request-promise');
const app = express();
const port = 8123;
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

host = 'http://localhost:8080'

app.post('/quote', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Quote endpoint');
  rp({
    method: 'POST',
    uri: host + '/quote',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey');
});

app.post('/add', function(req, res) {
  const amount = parseFloat(req.body.amount);
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Add endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: host + '/add',
      body: { ...req.body, amount, transactionNum },
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey')
  }
});

app.post('/buy', function(req, res) {
  console.log('Buy endpoint');
  const amount = parseFloat(req.body.amount);
  const transactionNum = parseInt(req.body.transactionNum);
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: host + '/buy',
      body: { ...req.body, amount, transactionNum },
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey')
  }
});

app.post('/commit_buy', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Commit Buy endpoint');
  rp({
    method: 'POST',
    uri: host + '/commit_buy',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/cancel_buy', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Cancel buy endpoint');
  rp({
    method: 'POST',
    uri: host + '/cancel_buy',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/sell', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  const amount = parseFloat(req.body.amount);
  console.log('Sell endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: host + '/sell',
      body: { ...req.body, amount, transactionNum },
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey')
  }
});

app.post('/commit_sell', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Commit sell endpoint');
  rp({
    method: 'POST',
    uri: host + '/commit_sell',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/cancel_sell', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Cancel sell endpoint');
  rp({
    method: 'POST',
    uri: host + '/cancel_sell',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/set_buy_amount', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  const amount = parseFloat(req.body.amount);
  console.log('Set buy amount endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: host + '/set_buy_amount',
      body: { ...req.body, amount, transactionNum },
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey')
  }
});

app.post('/cancel_set_buy', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Cancel set buy endpoint');
  rp({
    method: 'POST',
    uri: host + '/cancel_set_buy',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/set_buy_trigger', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  const price = parseFloat(req.body.price);
  console.log('Set sell trigger endpoint');
  rp({
    method: 'POST',
    uri: host + '/set_buy_trigger',
    body: { ...req.body, price, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/set_sell_amount', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  const amount = parseFloat(req.body.amount);
  console.log('Set sell amount endpoint');
  if (req.body.amount < 0) {
    res.send('Cannot add negative value')
  } else {
    rp({
      method: 'POST',
      uri: host + '/set_sell_amount',
      body: { ...req.body, amount, transactionNum },
      json: true
    })
      .then(data => {
        console.log('data is ', data);
      })
      .catch(err => {
        console.log('err is', err);
      })
    res.send('hey')
  }
});

app.post('/set_sell_trigger', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  const price = parseFloat(req.body.price);
  console.log('Set sell trigger endpoint');
  rp({
    method: 'POST',
    uri: host + '/set_sell_trigger',
    body: { ...req.body, price, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/cancel_set_sell', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Cancel set sell endpoint');
  rp({
    method: 'POST',
    uri: host + '/cancel_set_sell',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/dumplog', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Dumplog endpoint');
  rp({
    method: 'POST',
    uri: host + '/dumplog',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.post('/display_summary', function(req, res) {
  const transactionNum = parseInt(req.body.transactionNum);
  console.log('Display summary endpoint');
  rp({
    method: 'POST',
    uri: host + '/display_summary',
    body: { ...req.body, transactionNum },
    json: true
  })
    .then(data => {
      console.log('data is ', data);
    })
    .catch(err => {
      console.log('err is', err);
    })
  res.send('hey')
});

app.listen(port);
