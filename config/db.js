const {pool} = require('pg');

const pool = new Pool({
    user:"postgres",
    host:"localhost",
    database:"resume_portal",
    port:5432
});

module.exports = pool;