const express = require("express");
const router = express.Router();
const db = require("../db");

//Get all items from freezer database
router.get("/", async (req, res) => {
  try {
    const { rows } = await db.query("SELECT * FROM freezer_items"); // Adjust query to your database
    res.json(rows); // Return JSON data
  } catch (err) {
    console.error("Failed to fetch freezer items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//add an item to freezer database
router.post('/freezer-items', async (req, res) => {
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Name and quantity are required.' });
  }
  try {
    const { rows } = await db.query(
      'INSERT INTO freezer_items (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to add freezer item.');
  }
});

//update an item to freezer database
router.put('/freezer-items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;
  if (!name || !quantity) {
    return res.status(400).json({ error: 'Name and quantity are required.' });
  }
  try {
    const { rows } = await db.query(
      'UPDATE freezer_items SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [name, quantity, id]
    );
    res.status(200).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to update freezer item.');
  }
});

//delete an item from freezer database
router.delete('/freezer-items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM freezer_items WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to delete freezer item.');
  }
});

module.exports = router;