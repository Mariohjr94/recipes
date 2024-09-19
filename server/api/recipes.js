const express = require("express");
const router = express.Router();
const db = require("../db");
const authenticateToken = require("../middleware/authenticateToken")

// Middleware to check if the user is logged in (admin)
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});

// Get all recipes
router.get("/", async (req, res, next) => {
  try {
    const { rows: recipes } = await db.query("SELECT * FROM recipe");
    res.send(recipes);
  } catch (error) {
    next(error);
  }
});

// Get a recipe by id
router.get("/:id", async (req, res, next) => {
  try {
    const {
      rows: [recipe],
    } = await db.query("SELECT * FROM recipe WHERE id = $1", [req.params.id]);

    if (!recipe) {
      return res.status(404).send("Recipe not found.");
    }

    res.send(recipe);
  } catch (error) {
    next(error);
  }
});

// Create a new recipe
router.post("/", authenticateToken, async (req, res, next) => {
  try {
    const { name, ingredients, instructions, image, category_id } = req.body;
    const {
      rows: [recipe],
    } = await db.query(
      "INSERT INTO recipe (name, ingredients, instructions, image, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name, ingredients, instructions, image, category_id]
    );
    res.status(201).send(recipe);
  } catch (error) {
    next(error);
  }
});

// Update a recipe
router.put("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { name, ingredients, instructions, image, category_id } = req.body;
    const {
      rows: [recipe],
    } = await db.query(
      "UPDATE recipe SET name = $1, ingredients = $2, instructions = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *",
      [name, ingredients, instructions, image, category_id, req.params.id]
    );

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
