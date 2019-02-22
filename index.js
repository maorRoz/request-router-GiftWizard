const express = require('express');

const app = express();

app.get('/*storeId/:storeId*', (req, res) => {
  const { storeId } = req.params;
  console.log(storeId);
  res.sendStatus(200);
});

app.all('/*', (req, res) => {
  const storeId = req.query.storeId || req.get('storeId') || req.params.storeId;
  const message = storeId || 'no';
  console.log(message);
  res.sendStatus(200);
});

module.exports = app;
