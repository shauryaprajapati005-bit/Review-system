import express from "express";
import mongoose from "mongoose";
import Review from "../models/Review.js";
import Content from "../models/Content.js";

const router = express.Router();

// get all reviews for one item
router.get("/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Invalid item ID" });
    }

    const reviews = await Review.find({ itemId })
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.json({ reviews, totalReviews: reviews.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// post a review — userId comes straight from the body for now, no auth check yet
router.post("/", async (req, res) => {
  try {
    const { itemId, userId, rating, comment } = req.body;

    if (!itemId || !mongoose.Types.ObjectId.isValid(itemId)) {
      return res.status(400).json({ error: "Valid itemId is required" });
    }
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Valid userId is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 10" });
    }
    if (!comment || comment.trim().length < 3) {
      return res.status(400).json({ error: "Comment must be at least 3 characters" });
    }

    const existingReview = await Review.findOne({ itemId, userId });
    if (existingReview) {
      return res.status(400).json({ error: "You have already reviewed this item" });
    }

    const review = await Review.create({ itemId, userId, rating, comment });

    // recalculate and cache the average rating on the Content doc
    const allReviews = await Review.find({ itemId });
    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    await Content.findByIdAndUpdate(itemId, {
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: allReviews.length,
    });

    res.status(201).json({
      review,
      averageRating: Number(averageRating.toFixed(1)),
      totalReviews: allReviews.length,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "You have already reviewed this item" });
    }
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;