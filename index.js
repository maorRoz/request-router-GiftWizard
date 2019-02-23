const express = require('express');

const loadBalancer = require('./loadBalancer');

const app = express();

app.all('/*storeId/:storeId*', (req, res) => {
  const { storeId } = req.params;
  console.log(storeId);
  loadBalancer.handle(storeId);
  res.sendStatus(200);
});

app.all('/*', (req, res) => {
  const storeId = req.query.storeId || req.get('storeId') || req.params.storeId;
  const message = storeId || 'no';
  console.log(message);
  loadBalancer.handle(storeId);
  res.sendStatus(200);
});

module.exports = app;
