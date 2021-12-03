import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true, default: null },
    alias: { type: String, trim: true, default: null },
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
        validate: /^$|19\d{2}|200\d{1}|201\d{1}|202[0-1]{1}/,
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
    phones: [
      {
        phone: { type: String, trim: true, maxlength: 30, minlength: 4 },
        type: {
          type: String,
          enum: ["Home", "Mobile", "Work"],
          default: "Mobile",
        },
      },
    ],
    role: {
      type: String,
      enum: ["user", "support", "admin"],
      default: "user",
    },
    avatar: { type: String, default: null },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    productCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    savedAddress: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address",
      },
    ],
    isActive: {
      type: String,
      default: "pending",
      enum: ["active", "pending", "blocked"],
    },
    /* For reset password */
    resetPasswordToken: {
      type: String,
    },
    activationToken: {
      type: String,
    },
    resetPasswordExpires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

/* eslint-disable-next-line func-names */
userSchema.methods.getPublicProfile = async function () {
  const user = this;

  const userData = user.toObject();

  delete userData.hash;
  delete userData.salt;
  return userData;
};

const User = mongoose.model("User", userSchema, "user");

export default User;
