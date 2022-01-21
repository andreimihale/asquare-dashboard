import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: { type: Number },
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    price: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema, "cart");

export default Cart;
