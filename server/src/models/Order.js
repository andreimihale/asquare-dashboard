import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    totalAmmount: {
      price: { type: Number, required: true },
      isDiscount: { type: Boolean, default: false },
      discountType: {
        type: String,
        default: "percent",
        enum: ["percent", "amount"],
      },
      discount: { type: Number, default: 0 },
      totalPrice: { type: Number, required: true },
    },
    status: {
      type: String,
      default: "pending",
      enum: [
        "pending",
        "collecting",
        "delivering",
        "delivered",
        "canceled",
        "returned",
      ],
    },
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
      invoiceAddress: {
        building: { type: String, maxlength: 60 },
        houseNumber: { type: String, maxlength: 60 },
        unit: { type: String, maxlength: 60 },
        street: { type: String, maxlength: 60, required: true },
        postCode: { type: String, maxlength: 20 },
        locality: { type: String, maxlength: 60, required: true },
        city: { type: String, maxlength: 60 },
        county: { type: String, maxlength: 60 },
        country: { type: String, maxlength: 60, required: true },
      },
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
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");

export default Order;
