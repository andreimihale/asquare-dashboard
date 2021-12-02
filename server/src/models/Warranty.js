import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
  {
    expirationDate: { type: Date, required: true },
    warrantyType: {
      type: String,
      default: "Warranty",
      enum: ["Warranty", "Extended Warranty", "No Warranty"],
    },
    warrantyPeriod: { type: Number, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

const Warranty = mongoose.model("Warranty", warrantySchema, "warranty");

export default Warranty;
