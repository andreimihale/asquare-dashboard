import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 200 },
    description: { type: String, required: true, maxlength: 2000 },
    image: { type: String, default: "" },
    discountType: {
      type: String,
      default: "percentage",
      enum: ["percentage", "amount"],
    },
    discount: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isAdd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Voucher = mongoose.model("Voucher", voucherSchema, "voucher");

export default Voucher;
