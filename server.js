import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import contentRoutes from "./routes/content.js";
import reviewRoutes from "./routes/reviews.js";

dotenv.config();
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/content", contentRoutes);
app.use("/api/reviews", reviewRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error(err));

app.listen(5000, () => {
  console.log("🚀 Server started on port 5000");
});