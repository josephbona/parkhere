const pgp = require('pg-promise')();
const parse = require('./parse').parse;
let db;

function connect() {

  if (!db) {
    db = pgp('postgres://localhost:5432/park_test');
    return db;
  }
  return db;
}

const sql = `SELECT objectid, signdesc1 FROM signs;`;
connect();
db.many(sql)
.then(results => {
	results.forEach(result => {
		const {objectid, signdesc1} = result;
		let {type, schedule} = parse(signdesc1);
		schedule = JSON.stringify(schedule);
		// console.log(type, schedule);
		db.query(`UPDATE signs SET type = ${type} WHERE objectid = ${objectid}`);
	});
});