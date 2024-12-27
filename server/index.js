const express = require("express");
const authRoutes = require("./routes/auth.js");
const userRoutes = require("./routes/user.js");
const challengesRouter = require("./routes/challenges");
const userChallengeRoutes = require("./routes/userChallenges");
const analyticsRouter = require("./routes/analytics");
const cors = require("cors");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const cron = require("node-cron");
const { db } = require("./connect");

const app = express();

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../client/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  const file = req.file;
  res.status(200).json(file.filename);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/challenges", challengesRouter);
app.use("/userChallenges", userChallengeRoutes);
app.use("/api/analytics", analyticsRouter);

// CRON job for incrementing points
cron.schedule("0 0 * * *", () => {
  console.log("Running daily increment of points...");
  const incrementPointsQuery = `
    UPDATE user_challenges 
    SET point = point + 10
  `;
  db.query(incrementPointsQuery, (err, result) => {
    if (err) {
      console.error("Error incrementing points:", err);
    } else {
      console.log("Points incremented successfully for all users.");
    }
  });
});

app.listen(8800, () => {
  console.log("API working on port 8800!");
});
