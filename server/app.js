const express = require('express');
const path = require('path');
const app = express();

module.exports = app;


app.use('/scripts', express.static('scripts'));

app.use(require('body-parser').json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use('/api', require('./routes'));

app.use('/api', require('./api'));

