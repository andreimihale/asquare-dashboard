import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  currency: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Unpaid", "On Hold"],
  },
  cardDetails: {
    stripeId: { type: String },
    brand: { type: String },
    last4digits: { type: String },
    expMonth: { type: Number },
    expYear: { type: Number },
  },
  paymentType: {
    type: String,
    required: true,
    default: "card",
    enum: ["card", "cash", "bank_transfer", "paypal"],
  },
  paymentId: { type: String, default: null },
  paymentDescription: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema, "payment");

export default Payment;
