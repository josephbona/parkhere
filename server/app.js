const express = require('express');
const swig = require('swig');
const path = require('path');
const app = express();

module.exports = app;

app.engine('html', swig.renderFile);
app.set('view engine', 'html');

app.use('/scripts', express.static('scripts'));

app.use(require('body-parser').json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.render('index');
});

// app.use('/api', require('./routes'));

app.use('/api', require('./api'));

