const pgp = require('pg-promise')();
const parse = require('./parse').parse;
const { credentials } = require('../credentials');
let db;

function connect() {

  if (!db) {
    db = pgp(credentials);
    return db;
  }
  return db;
}

// GeoJSON Feature Collection
function FeatureCollection() {
  this.type = 'FeatureCollection';
  this.features = new Array();
}

module.exports = {
  getListings: function(bounds) {
    const sql = `SELECT *, ST_ASGeoJSON(geom) as geom from listings WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326);`;
    connect();
    return db.many(sql)
      .then(results => {        
        results.forEach((result) => {
          result.geom = JSON.parse(result.geom);
          result.geom.coordinates.reverse();
        });
        return results;
      })
      .catch(error => console.log(error));
  },
  addListing: function(newListing) {
    const sql = `INSERT INTO listings (renter_email, rentee_email, price, period, active, amenities, pics, address, city, description, geom) VALUES ('${newListing.renterEmail }', '', '${newListing.price }', '${newListing.listingEnd }', 1, '"[${newListing.amenities }]"', '', '${newListing.address }', '${newListing.city }' ,'${ newListing.description }', ST_GeomFromTexT('POINT(${ newListing.geom.lng } ${newListing.geom.lat })', 4326));`;
    connect();
    return db.one(sql)
      .then(results => {        
        results.forEach((result) => {
          result.geom = JSON.parse(result.geom);
          result.geom.coordinates.reverse();
        });
        return results;
      })
      .catch(error => console.log(error));
  },
  getSigns: function(bounds) {
    const sql = `SELECT objectid, sg_order_n, sg_seqno_n AS seqno, signdesc1, ST_AsGeoJSON(geom) as geom FROM signs WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326) ORDER BY CAST(sg_seqno_n AS INTEGER);`;


    connect();
    return db.many(sql)
      .then(results => {

        const featureCollection = new FeatureCollection();

        results.forEach((result) => {
          let feature = {};
          feature.type = 'Feature';
          feature.geometry = JSON.parse(result.geom);
          feature.objectid = result.objectid;
          feature.sg_order_n = result.sg_order_n;
          feature.seqno = result.seqno;
          feature.signdesc = result.signdesc1;
          feature.arrow = result.arrow || null;
          let p = parse(feature.signdesc);
          feature.regType = p.type;
          if (p.type === "UNKNOWN" || p.type === "BUS INFO")
            return;
          feature.schedule = p.schedule;
          featureCollection.features.push(feature);
        });

        return featureCollection;
      })
      .catch(error => console.log(error));

  }
};
