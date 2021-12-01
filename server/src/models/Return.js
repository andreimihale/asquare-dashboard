import mongoose from "mongoose";

const returnSchema = new mongoose.Schema({
  returnDate: { type: Date, default: Date.now },
  returnReason: { type: String, required: true },
  returnStatus: {
    type: String,
    default: "",
    enum: ["pending", "approved", "rejected", "to warehouse"],
  },
  isReturnedBy: {
    type: String,
    required: true,
    enum: ["customer", "admin"],
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  ],
});

const Return = mongoose.model("Return", returnSchema);

export default Return;
