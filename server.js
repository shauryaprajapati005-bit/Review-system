import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// TEMPORARY test route - confirms User model + password hashing work.
// Delete this route once you've verified it in your database.
app.post("/test-user", async (req, res) => {
  try {
    const user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error(err);
  });

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});