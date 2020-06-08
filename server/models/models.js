const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./models/db.sqlite3');

// db.close();

module.exports = db