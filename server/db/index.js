const pgp = require('pg-promise')();
const parse = require('./parse').parse;
let db;

function connect() {
  const connString = 'postgres://localhost/postgistest';

  if (!db) {
    db = pgp(connString);
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
  findAll: function(bounds) {
    const sql = `SELECT objectid, sg_order_n, sg_seqno_n AS seqno, signdesc1, ST_AsGeoJSON(geom) as geom FROM parking WHERE geom && ST_MakeEnvelope(${ bounds._southWest.lng }, ${ bounds._southWest.lat }, ${ bounds._northEast.lng }, ${ bounds._northEast.lat }, 4326) ORDER BY CAST(sg_seqno_n AS INTEGER);`;

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
          let p = parse(feature.signdesc);
          feature.regType = p.type;
          feature.schedule = p.schedule;
          featureCollection.features.push(feature);
        });

        return featureCollection;
      })
      .catch(error => console.log(error));

  }
};
