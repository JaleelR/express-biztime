/** Database setup for BizTime. */
//only need client from pg
const { Client } = require("pg")

let DB_URI;

//if Node_ENV mode is in test, then use our test db 
//else regular db
if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime"
}

//where is the db we are connecting to?
let db = new Client({
    connectionString: DB_URI
})


//starts up connection 
db.connect();

module.exports = db;