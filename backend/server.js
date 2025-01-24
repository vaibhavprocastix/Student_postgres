const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

app.get("/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/students/:id", async (req, res) => {
  const { id } = req.params;
  const { name, age } = req.body;
  try {
    const result = await pool.query(
      "UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *",
      [name, age, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).send(`Student with ID ${id} not found.`);
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/students", async (req, res) => {
  const { name, age } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO students (name, age) VALUES ($1, $2) RETURNING *",
      [name, age]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/students/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM students WHERE id = $1", [id]);
    res.send(`Student with ID ${id} was deleted`);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(port, () =>
  console.log(`Server is running on http://localhost:${port}`)
);
