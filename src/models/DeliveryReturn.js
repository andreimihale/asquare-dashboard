import mongoose from "mongoose";

const deliveryReturnSchema = new mongoose.Schema({
  deliveryReturnId: { type: String, required: true },
  returnDate: { type: Date, required: true },
  returnReason: { type: String, required: true },
  deliveryAddress: {
    departingFrom: {
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
    arrivingTo: {
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
  personOfContact: {
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
  returnStatus: {
    type: String,
    default: "collecting",
    enum: ["collecting", "delivering", "delivered"],
  },
  returnId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Return",
    required: true,
  },
  returnItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const DeliveryReturn = mongoose.model(
  "DeliveryReturn",
  deliveryReturnSchema,
  "deliveryReturn"
);

export default DeliveryReturn;
