const express = require('express');

const loadBalancer = require('./loadBalancer');

const addService = service => loadBalancer.subscribe(service);

const requestRouter = express();

requestRouter.all('/*storeId/:storeId*', (req, res, next) => {
  const { storeId } = req.params;
  loadBalancer.handle(storeId, req);
  next();
});

requestRouter.all('/*', (req, res, next) => {
  const storeId = req.query.storeId || req.get('storeId');
  if(storeId){
    loadBalancer.handle(storeId, req);
  }
  next();
});


module.exports = {
  requestRouter,
  addService
};
