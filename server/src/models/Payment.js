import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  currency: { type: String, required: true },
  paymentDate: { type: Date, default: Date.now },
  paymentStatus: {
    type: String,
    required: true,
    enum: ["Paid", "Unpaid", "On Hold"],
  },
  paymentType: {
    type: String,
    required: true,
    enum: ["credit", "cash", "bank_transfer"],
  },
  paymentId: { type: String, default: null },
  paymentDescription: { type: String, required: true },
  paymentAmount: { type: Number, required: true },
});

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
