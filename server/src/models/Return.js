import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  returnDate: { type: Date, default: Date.now },
  returnReason: { type: String, required: true },
  returnStatus: {
    type: String,
    default: "",
    enum: [
      "pending",
      "approved",
      "rejected",
      "collecting",
      "collected",
      "to warehouse",
    ],
  },
  isReturnedBy: {
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
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  contactDetails: {
    address: {
      building: { type: String, maxlength: 60 },
      houseNumber: { type: String, maxlength: 60 },
      unit: { type: String, maxlength: 60 },
      street: { type: String, required: true, maxlength: 60 },
      postCode: { type: String, maxlength: 20 },
      locality: { type: String, required: true, maxlength: 60 },
      city: { type: String, required: true, maxlength: 60 },
      county: { type: String, required: true, maxlength: 60 },
      country: { type: String, required: true, maxlength: 60 },
      type: {
        type: String,
        default: "HOMEADDRESS",
        enum: ["HOMEADDRESS", "STOREADDRESS"],
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
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
    customerDetails: {
      firstName: { type: String, required: true, maxlength: 60 },
      lastName: { type: String, required: true, maxlength: 60 },
      middleName: { type: String, maxlength: 60 },
    },
  },
});

const Return = mongoose.model("Return", returnSchema, "return");

export default Return;
