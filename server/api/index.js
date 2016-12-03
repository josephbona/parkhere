const route = require('express').Router();

module.exports = route;

route.use('/map', require('./maps'));