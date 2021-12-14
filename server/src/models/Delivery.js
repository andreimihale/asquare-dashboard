import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryLink: { type: String, default: null },
  contactDetails: {
    deliveryAddress: {
      building: { type: String, maxlength: 60 },
      houseNumber: { type: String, maxlength: 60 },
      unit: { type: String, maxlength: 60 },
      street: { type: String, maxlength: 60, required: true },
      postCode: { type: String, maxlength: 20 },
      locality: { type: String, maxlength: 60, required: true },
      city: { type: String, maxlength: 60, required: true },
      county: { type: String, maxlength: 60 },
      country: { type: String, maxlength: 60, required: true },
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
  },
  deliveryStatus: {
    type: String,
    default: "collecting",
    enum: ["collecting", "delivering", "delivered"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  paymentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  deliveryType: {
    type: String,
    enum: ["delivery", "pickup"],
    required: true,
  },
  deliveryPrice: { type: Number, required: true },
  deliveryFee: { type: Number, required: true },
  deliveryTotal: { type: Number, required: true },
  deliveryNote: { type: String, default: null },
  deliveryItems: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
});

const Delivery = mongoose.model("Delivery", deliverySchema, "delivery");

export default Delivery;
