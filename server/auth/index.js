const router = require("express").Router();
const db = require("../db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Register a new  account
router.post("/register", async (req, res, next) => {
  try {
    const {
      rows: [admin],
    } = await db.query(
      "INSERT INTO admin (username, password) VALUES ($1, $2) RETURNING *",
      [req.body.username, req.body.password]
    );

    // Create a token with the instructor id
    const token = jwt.sign({ id: admin.id }, process.env.JWT);

    res.status(201).send({ token });
  } catch (error) {
    next(error);
  }
});

// Login to an existing admin account
router.post("/login", async (req, res, next) => {
  try {
    const {
      rows: [admin],
    } = await db.query(
      "SELECT * FROM admin WHERE username = $1 AND password = $2",
      [req.body.username, req.body.password]
    );

    if (!admin) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );

    if (!validPassword) {
      return res.status(401).send("Invalid login credentials.");
    }

    // Create a token with the instructor id
    const token = jwt.sign({ id: admin.id }, process.env.JWT);

    res.send({ token });
  } catch (error) {
    next(error);
  }
});

// Get the currently logged in admin
router.get("/me", async (req, res, next) => {
  try {
    const {
      rows: [admin],
    } = await db.query("SELECT * FROM admin WHERE id = $1", [
      req.user?.id,
    ]);

    res.send(admin);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
