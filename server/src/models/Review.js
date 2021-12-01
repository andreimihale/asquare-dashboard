import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    title: { type: String, maxlength: 100 },
    description: { type: String, maxlength: 2000 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;
