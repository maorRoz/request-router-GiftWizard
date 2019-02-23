/* eslint-disable no-console */
const express = require('express');
const ExecutionService = require('./models/ExecutionService');
const { requestRouter, addService } = require('./index');

const app = express();

app.use('/', requestRouter);

app.get('/*', (req, res) => {
  res.sendStatus(200);
});

const service1 = new ExecutionService(storeId => console.log(`yay1 ${storeId}`));
const service2 = new ExecutionService(storeId => console.log(`yay2 ${storeId}`));
addService(service1);
addService(service2);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
