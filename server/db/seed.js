
const db = require("../db");
const bcrypt = require("bcryptjs");

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

    //seeding info  -----------------------

     // Insert some default categories 
    const categories = ['Breakfast', 'Lunch', 'Dinner'];
    for (const name of categories) {
      await db.query('INSERT INTO category (name) VALUES ($1);', [name]);
    }

    // Insert an admin user (with hashed password)
    const hashedPassword = await bcrypt.hash('12345', 10);
    await db.query('INSERT INTO admin (username, password) VALUES ($1, $2);', [
      'test1',
      hashedPassword,
    ]);

    // Insert some default recipes
    await db.query(
      'INSERT INTO recipe (name, ingredients, instructions, image, category_id) VALUES ($1, $2, $3, $4, $5);',
      ['Pancakes', ['Flour', 'Milk', 'Eggs'], 'Mix ingredients and cook.', 'pancakes.jpg', 1]
    );
    await db.query(
      'INSERT INTO recipe (name, ingredients, instructions, image, category_id) VALUES ($1, $2, $3, $4, $5);',
      ['Salad', ['Lettuce', 'Tomatoes', 'Cucumbers'], 'Chop and mix.', 'salad.jpg', 2]
    );

// -----------------------------------

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
