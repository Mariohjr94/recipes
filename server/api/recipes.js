const express = require("express");
const router = express.Router();
const db = require("../db");
const multer = require('multer');
const upload = multer(); 
const authenticateToken = require("../middleware/authenticateToken");

// Get all recipes (public, no authentication)
router.get('/', async (req, res, next) => {
  try {
    const { rows: recipes } = await db.query('SELECT * FROM recipe');

    // Convert the buffer (image) to base64 format
    const updatedRecipes = recipes.map((recipe) => {
     if (Buffer.isBuffer(recipe.image)) {
        recipe.image = `data:image/jpeg;base64,${Buffer.from(recipe.image).toString('base64')}`;
      }
      return recipe;
    });

    console.log(updatedRecipes);

    res.json(updatedRecipes);
  } catch (error) {
    next(error); // Forward the error to the error handler middleware
  }
});

// Get a recipe by id (public, no authentication)
router.get("/:id", async (req, res, next) => {
  try {
    const {
      rows: [recipe],
    } = await db.query("SELECT * FROM recipe WHERE id = $1", [req.params.id]);

    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }

    // Convert image to base64 if it's a Buffer
    if (Buffer.isBuffer(recipe.image)) {
      recipe.image = `data:image/jpeg;base64,${Buffer.from(recipe.image).toString('base64')}`;
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// Protected Routes (require login):
// Create a new recipe
router.post("/", authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    const { name, ingredients, instructions, category_id } = req.body;
    const image = req.file ? req.file.buffer : null;  // Handle image

    // Log incoming data for debugging
    console.log("Received data:", req.body);

    // const parsedIngredients = JSON.parse(ingredients); 
    // const parsedInstructions = JSON.parse(instructions);

    // Insert into the database
    const { rows: [recipe] } = await db.query(
      "INSERT INTO recipe (name, ingredients, instructions, image, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, ingredients, instructions, image, category_id]
    );

    res.status(201).send(recipe);
  } catch (error) {
    console.error("Error inserting recipe:", error);
    next(error);
  }
});

// Update a recipe
router.put("/:id", authenticateToken, upload.single('image'), async (req, res, next) => {
  try {
    const { name, ingredients, instructions, category_id } = req.body;

    const image = req.file ? req.file.buffer : undefined;

     const query = `
      UPDATE recipe 
      SET name = $1, ingredients = $2, instructions = $3, 
          image = COALESCE($4, image), category_id = $5 
      WHERE id = $6 
      RETURNING *`;
    
    const values = [
      name, 
      JSON.parse(ingredients), 
      JSON.parse(instructions),
      image, 
      category_id, 
      req.params.id];

    const { rows: [recipe] } = await db.query(query, values);
   
    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// Delete a recipe by id
router.delete("/:id", authenticateToken, async (req, res, next) => {
  try {
    const {
      rows: [recipe],
    } = await db.query(
      "DELETE FROM recipe WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
