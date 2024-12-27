const express = require("express");
const router = express.Router();
const { db } = require("../connect.js");

// POST endpoint to accept a challenge
router.post("/", (req, res) => {
  const { cha_user_id, challenge_id } = req.body;

  if (!cha_user_id || !challenge_id) {
    return res.status(400).json({ error: "cha_user_id and challenge_id are required" });
  }

  const point = 0; // Initialize points to 0

  const insertQuery = `
    INSERT INTO user_challenges (cha_user_id, challenge_id, point) 
    VALUES (?, ?, ?)
  `;

  db.query(insertQuery, [cha_user_id, challenge_id, point], (err, result) => {
    if (err) {
      console.error("Error inserting challenge acceptance:", err);
      return res.status(500).json({ error: "Error accepting challenge." });
    }

    res.status(200).json({
      message: "Challenge accepted successfully!",
      cha_user_id,
      challenge_id,
      point,
    });
  });
});

// **New API Endpoint to Increment Points**
router.post("/increment-points", (req, res) => {
  const incrementPointsQuery = `
    UPDATE user_challenges SET point = point + 10;
  `;

  db.query(incrementPointsQuery, (err, result) => {
    if (err) {
      console.error("Error incrementing points:", err);
      return res.status(500).json({ error: "Error incrementing points." });
    }

    res.status(200).json({ message: "Points incremented successfully!" });
  });
});

module.exports = router;
