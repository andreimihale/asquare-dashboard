import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    isDiscount: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
    isPaid: { type: Boolean, default: false },
    isCanceled: { type: Boolean, default: false },
    isDelivered: { type: Boolean, default: false },
    isReturned: { type: Boolean, default: false },
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "paid", "canceled", "delivered", "returned"],
    },
    contactDetails: {
      name: { type: String, required: true },
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
    deliveryAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    invoiceAddressId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      reqired: true,
    },
    paymentId: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    deliveryId: { type: mongoose.Schema.Types.ObjectId, ref: "Delivery" },
    returnId: { type: mongoose.Schema.Types.ObjectId, ref: "Return" },
    voucherId: { type: mongoose.Schema.Types.ObjectId, ref: "Voucher" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
