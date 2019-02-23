const express = require('express');

const loadBalancer = require('./loadBalancer');

const app = express();

app.all('/*storeId/:storeId*', (req, res, next) => {
  const { storeId } = req.params;
  loadBalancer.handle(storeId, req);
  next();
});

app.all('/*', (req, res, next) => {
  const storeId = req.query.storeId || req.get('storeId');
  if(storeId){
    loadBalancer.handle(storeId, req);
  }
  next();
});

module.exports = app;
