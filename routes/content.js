import express from "express";
import Content from "../models/Content.js";

const router = express.Router();

// add a new movie/show
router.post("/", async (req, res) => {
  try {
    const { title, description, genre, releaseYear, coverImage, cast } = req.body;

    if (!title || !description || !genre || !releaseYear) {
      return res
        .status(400)
        .json({ error: "title, description, genre, and releaseYear are required" });
    }

    const content = await Content.create({
      title,
      description,
      genre,
      releaseYear,
      coverImage,
      cast,
    });
    res.status(201).json(content);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// list everything
router.get("/", async (req, res) => {
  try {
    const items = await Content.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// single item detail page
router.get("/:id", async (req, res) => {
  try {
    const item = await Content.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;