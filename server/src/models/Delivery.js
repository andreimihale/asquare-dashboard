import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema({
  deliveryId: { type: String, required: true },
  deliveryDate: { type: Date, required: true },
  deliveryLink: { type: String, default: null },
  deliveryAddressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Address",
  },
  contactDetails: {
    deliveryAddress: {
      building: { type: String, maxlength: 60 },
      houseNumber: { type: String, maxlength: 60 },
      unit: { type: String, maxlength: 60 },
      street: { type: String, maxlength: 60 },
      postCode: { type: String, maxlength: 20 },
      locality: { type: String, maxlength: 60 },
      city: { type: String, maxlength: 60 },
      county: { type: String, maxlength: 60 },
      country: { type: String, maxlength: 60 },
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
  paymentType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
    required: true,
  },
  deliveryType: {
    type: String,
    enum: ["delivery", "pickup"],
  },
  deliveryPrice: { type: Number, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  deliveryTotal: { type: Number, default: 0 },
  deliveryNote: { type: String, default: null },
  deliveryItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Delivery = mongoose.model("Delivery", deliverySchema, "delivery");

export default Delivery;
