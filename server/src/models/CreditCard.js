import mongoose from "mongoose";

const creditCardSchema = new mongoose.Schema(
  {
    last4digits: { type: String, required: true },
    expiryMonth: { type: Number, required: true },
    expiryYear: { type: Number, required: true },
    brand: { type: String, required: true },
    country: { type: String, required: true },
  },
  { timestamps: true }
);

const CreditCard = mongoose.model("CreditCard", creditCardSchema, "creditCard");

export default CreditCard;
