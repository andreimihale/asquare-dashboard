import mongoose from "mongoose";

const warrantySchema = new mongoose.Schema(
  {
    expirationDate: { type: Date, required: true },
    warrantyType: {
      type: String,
      default: "warranty",
      enum: ["warranty", "extendedWarranty", "noWarranty"],
    },
    warrantyPeriod: { type: Number, default: 24 },
    warrantyPeriodType: {
      type: String,
      enum: ["day", "month", "year"],
      default: "month",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customerDetails: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      phones: [
        {
          phone: { type: String, required: true, maxlength: 30, minlength: 4 },
          type: {
            type: String,
            required: true,
            enum: ["Home", "Work", "Mobile"],
          },
        },
      ],
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
    productSku: { type: String, required: true },
  },
  { timestamps: true }
);

const Warranty = mongoose.model("Warranty", warrantySchema, "warranty");

export default Warranty;
