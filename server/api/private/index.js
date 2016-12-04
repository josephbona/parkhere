const route = require('express').Router();
const { getListings } = require('../../db');

module.exports = route;

route.post('/points', (req, res, next) =>{
  getListings(req.body)
    .then(featureCollection => {
      res.send(featureCollection);
    })
    .catch(next);
});