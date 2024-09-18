const express = require("express");
const router = express.Router();
const db = require("../db");

// Middleware to check if the user is logged in (admin)
router.use((req, res, next) => {
  if (!req.user) {
    return res.status(401).send("You must be logged in to do that.");
  }
  next();
});

// Get all categories
router.get("/", async (req, res, next) => {
  try {
    const { rows: categories } = await db.query("SELECT * FROM category");
    res.send(categories);
  } catch (error) {
    next(error);
  }
});

// Create a new category
router.post("/", async (req, res, next) => {
  try {
    const { name } = req.body;
    const {
      rows: [category],
    } = await db.query(
      "INSERT INTO category (name) VALUES ($1) RETURNING *",
      [name]
    );
    res.status(201).send(category);
  } catch (error) {
    next(error);
  }
});

// Delete a category by id
router.delete("/:id", async (req, res, next) => {
  try {
    const {
      rows: [category],
    } = await db.query(
      "DELETE FROM category WHERE id = $1 RETURNING *",
      [req.params.id]
    );

    if (!category) {
      return res.status(404).send("Category not found.");
    }

    res.send(category);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
