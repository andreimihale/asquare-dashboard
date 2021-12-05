import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    brandDescription: { type: String, required: true },
    brandImage: { type: String },
  },
  { timestamps: true }
);

const Brand = mongoose.model("Brand", brandSchema, "brand");

export default Brand;
