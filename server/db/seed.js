
const db = require("../db");

async function seed() {
  console.log("Seeding the database.");
  try {

    await db.query("DROP TABLE IF EXISTS recipe, category, admin CASCADE;");

    // Create admin table
    await db.query(`
      CREATE TABLE admin (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
      `);
// create category table
      await db.query(`
        CREATE TABLE category (
  id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      );
    `);

     // Create recipe table
    await db.query(`
      CREATE TABLE recipe (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        ingredients TEXT[] NOT NULL,
        instructions TEXT NOT NULL,
        image TEXT,
        category_id INTEGER REFERENCES category(id) ON DELETE SET NULL
      );
    `);

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  }
}

// Seed the database if we are running this file directly.
if (require.main === module) {
  seed();
}

module.exports = seed;
