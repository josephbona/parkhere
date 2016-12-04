const route = require('express').Router();

module.exports = route;

route.use('/street', require('./street'));
route.use('/private', require('./private'));
