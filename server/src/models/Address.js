import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
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
      required: true,
      enum: ["HOMEADDRESS", "STOREADDRESS"],
    },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);

export default Address;
