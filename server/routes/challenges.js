const express = require("express");
const { db } = require("../connect.js");
const router = express.Router(); 


router.get("/", (req, res) => {
  db.query("SELECT * FROM challenge", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching challenges.");
    } else {
      res.status(200).json(results);
    }
  });
});


router.post("/", (req, res) => {
  const { name, description, created_by } = req.body;

  if (!name || !description || !created_by) {
    return res.status(400).json({ error: "Name, description, and created_by are required" });
  }

  const query = 'INSERT INTO challenge (name, description, created_by) VALUES (?, ?, ?)'; 
  db.query(query, [name, description, created_by], (err, result) => {
    if (err) {
      console.error('Error creating challenge:', err.message);
      return res.status(500).json({ error: "Error creating challenge", message: err.message });
    }

    res.status(201).json({
      message: "Challenge created successfully!",
      challenge: {
        id: result.insertId,
        name,
        description, 
        created_by,
      },
    });
  });
});
module.exports = router;
