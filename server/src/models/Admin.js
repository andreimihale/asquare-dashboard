import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    middleName: { type: String, trim: true },
    alias: { type: String, trim: true },
    dateOfBirth: {
      day: {
        type: String,
        required: true,
        validate: /^$|0[1-9]{1}|[12]\d{1}|3[01]{1}/,
      },
      month: {
        type: String,
        required: true,
        validate: /^$|0[1-9]{1}|1[012]{1}/,
      },
      year: {
        type: String,
        required: true,
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
      required: true,
    },
    avatar: { type: String },
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
      default: "active",
      enum: ["active", "pending", "blocked"],
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    department: {
      type: String,
      enum: ["sales", "office", "support", "hr", "it", "marketing", "other"],
      required: true,
    },
    /* For reset password */
    resetPasswordToken: {
      type: String,
      required: true,
    },
    resetPasswordExpires: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema, "admin");

export default Admin;
