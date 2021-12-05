import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  returnDate: { type: Date, default: Date.now },
  returnReason: { type: String, required: true },
  returnPrice: { type: Number, required: true },
  returnStatus: {
    type: String,
    default: "pending",
    enum: [
      "pending",
      "approved",
      "rejected",
      "collecting",
      "collected",
      "toWarehouse",
    ],
  },
  returnedBy: {
    type: String,
    required: true,
    enum: ["customer", "admin"],
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contactDetails: {
    customerAddress: {
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
});

const Return = mongoose.model("Return", returnSchema, "return");

export default Return;
