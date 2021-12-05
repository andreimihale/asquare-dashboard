import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

const Subscribe = mongoose.model("Subscribe", subscribeSchema, "subscribe");

export default Subscribe;
