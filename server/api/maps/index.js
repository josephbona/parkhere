const route = require('express').Router();
const { findAll, deleteOne } = require('../../db');

module.exports = route;

route.post('/points', (req, res, next) =>{
  findAll(req.body)
    .then(featureCollection => {
      res.send(featureCollection);
    })
    .catch(next);
});