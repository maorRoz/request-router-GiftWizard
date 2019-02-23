/* eslint-disable no-console */
const express = require('express');
const { requestRouter } = require('./index');

const app = express();

app.use('/', requestRouter);

app.get('/*', (req, res) => {
  res.sendStatus(200);
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
