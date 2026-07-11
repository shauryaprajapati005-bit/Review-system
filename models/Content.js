import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    genre: {
      type: [String],
      required: true,
    },
    releaseYear: {
      type: Number,
      required: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    cast: {
      type: [String],
      default: [],
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;