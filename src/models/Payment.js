import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  customerDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phones: [
      {
        phone: {
          type: String,
          required: true,
          maxlength: 30,
          minlength: 4,
        },
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
  currency: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["paid", "unpaid", "onHold"],
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
    enum: ["card", "cashOnDelivery", "cashInShop", "bankTransfer", "paypal"],
  },
  stripePaymentId: { type: String },
  paymentDescription: { type: String },
  paymentAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema, "payment");

export default Payment;
