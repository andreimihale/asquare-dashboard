import mongoose from "mongoose";

const creditCardSchema = new mongoose.Schema(
  {
    last4digits: { type: String, required: true },
    expiryMonth: { type: String, required: true },
    expiryYear: { type: String, required: true },
    brand: { type: String, required: true },
    country: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const CreditCard = mongoose.model("CreditCard", creditCardSchema, "creditCard");

export default CreditCard;
