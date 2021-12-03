import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 256 },
    description: { type: String, required: true, trim: true, maxlength: 50000 },
    image: [{ type: String, required: true, trim: true }],
    sku: { type: String, required: true },
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
    price: { type: Number, required: true },
    isOnSale: { type: Boolean, default: false },
    discountPrice: { type: Number },
    discount: { type: Number },
    stock: { type: Number, required: true },
    warrantyTime: { type: Number, default: 24 },
    warrantyType: { type: String, default: "month" },
    specs: { type: Object, required: true },
    variants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", default: null },
    ],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
    brand: { type: mongoose.Schema.Types.ObjectId, ref: "Brand" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "product");

export default Product;
