import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 256 },
    description: { type: String, required: true, trim: true, maxlength: 50000 },
    images: [{ type: String, required: true, trim: true }],
    sku: { type: String, required: true },
    price: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    discountPrice: { type: Number },
    discount: { type: Number },
    stock: { type: Number, required: true },
    manufacturerDetails: {
      modelNumber: { type: String, required: true, trim: true, maxlength: 256 },
      releaseDate: { type: Date, required: true },
    },
    productSize: {
      weight: { type: Number, required: true },
      width: { type: Number, required: true },
      height: { type: Number, required: true },
      depth: { type: Number, required: true },
    },
    rating: { type: Number, defaul: 0 },
    warrantyTime: { type: Number, default: 24 },
    warrantyType: {
      type: String,
      default: "month",
      enum: ["day", "month", "year"],
    },
    specs: { type: Object, required: true },
    variants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
      required: true,
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "product");

export default Product;
