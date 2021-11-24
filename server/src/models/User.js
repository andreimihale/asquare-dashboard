import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    salutation: { type: String, default: null },
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true },
    alias: { type: String, trim: true, default: null },
    confirmationCode: { type: String },
    isActive: { type: Boolean, default: false },
    dateOfBirth: {
      day: {
        type: String,
        default: "",
        validate: /^$|0[1-9]{1}|[12]\d{1}|3[01]{1}/,
      },
      month: {
        type: String,
        default: "",
        validate: /^$|0[1-9]{1}|1[012]{1}/,
      },
      year: {
        type: String,
        default: "",
        validate: /^$|19[4-9]{1}\d{1}|200\d{1}|201[0-9]{1}|202[0-1]{1}/,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    salt: { type: String, required: true },
    hash: { type: String, required: true },

    mobilePhoneNumber: { type: String, default: null },
    homePhoneNumber: { type: String, default: null },
    isAdmin: {
      type: String,
      default: "user",
    },
    avatar: { type: String, default: null },
    invoiceAddress: [
      {
        addressId: { type: String },
        address: {
          building: { type: String, default: null },
          countryCode: { type: String, default: null },
          country: { type: String, default: null },
          houseNumber: { type: String, default: null },
          locality: { type: String, default: null },
          postCode: { type: String, default: null },
          street: { type: String, default: null },
          town: { type: String, default: null },
          unit: { type: String, default: null },
        },
        contactDetails: {
          email: { type: String, default: null },
          phones: [
            {
              phone: { type: String, default: null },
              type: {
                type: String,
                default: null,
                validate: /^$|HOME|WORK|MOBILE/,
              },
            },
          ],
        },
        name: {
          first: { type: String, default: null },
          last: { type: String, default: null },
          middle: { type: String, default: null },
        },
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
export default User;
