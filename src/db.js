const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const isLocal = (process.env.DATABASE_URL || '').includes('localhost');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocal ? false : { rejectUnauthorized: false },
});

// Without this listener, an idle client error (e.g. the DB closing an idle
// connection) is an uncaught exception that crashes the whole process.
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

async function initSchema() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
}

module.exports = { pool, initSchema };
