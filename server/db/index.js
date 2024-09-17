const { Pool } = require("pg");
const db = new Pool({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://localhost:5432/postgres://localhost:5432/recipe_app",
});

async function query(sql, params, callback) {
  return db.query(sql, params, callback);
}

module.exports = { query };