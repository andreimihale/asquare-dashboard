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
    },
    isPaid: { type: Boolean, default: false },
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
        street: { type: String, maxlength: 60 },
        postCode: { type: String, maxlength: 20 },
        locality: { type: String, maxlength: 60 },
        city: { type: String, maxlength: 60 },
        county: { type: String, maxlength: 60 },
        country: { type: String, maxlength: 60 },
      },
      invoiceAddress: {
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

    deliveryAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },
    invoiceAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
    },

    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "order");

export default Order;
