const route = require('express').Router();
const { getSigns } = require('../../db');

module.exports = route;

route.post('/points', (req, res, next) =>{
  getSigns(req.body)
    .then(featureCollection => {
    	res.send(featureCollection);
    })
    .catch(next);
});