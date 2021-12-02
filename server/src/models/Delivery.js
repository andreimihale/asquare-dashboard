import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  delivery_id: { type: String, required: true },
  deliveryDate: { type: Date, default: Date.now },
  deliveryLink: { type: String, default: null },
  deliveryAddress: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
    required: true,
  },
  deliveryStatus: {
    type: String,
    default: "collecting",
    enum: ["collecting", "delivering", "delivered"],
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
});

const Delivery = mongoose.model("Delivery", deliverySchema, "delivery");

export default Delivery;
