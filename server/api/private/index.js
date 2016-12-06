const route = require('express').Router();
const { getListings, addListing } = require('../../db');

module.exports = route;

route.post('/points', (req, res, next) =>{
  getListings(req.body)
    .then(results => {
      res.send(results);
    })
    .catch(next);
});

route.post('/listing', (req, res, next) => {
  console.log(req.body)
  addListing(req.body)
    .then(_ => {
      res.status(201);
    })
    .catch(next);
});