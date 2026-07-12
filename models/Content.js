import mongoose from "mongoose";

// The thing being reviewed (movie, show, etc.) — reviews point back to this via itemId
const contentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    genre: { type: [String], required: true }, // array so multiple genres work
    releaseYear: { type: Number, required: true },
    coverImage: { type: String, default: "" }, // just a URL, not the actual file
    cast: { type: [String], default: [] },

    // cached values so we don't recalculate from all reviews every page load
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);
export default Content;