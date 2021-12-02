import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
    stripeId: { type: String, required: true },
    brand: { type: String, required: true },
    last4digits: { type: String, required: true },
    expMonth: { type: Number, required: true },
    expYear: { type: Number, required: true },
  },
  paymentType: {
    type: String,
    required: true,
    enum: ["credit", "cash", "bank_transfer", "debit"],
  },
  paymentId: { type: String, default: null },
  paymentDescription: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema, "payment");

export default Payment;
