import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
});

const transactionSchema = new mongoose.Schema({
  products: [productSchema],
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, default: 0 },
  remainingBalance: { type: Number, required: true },
  status: {
    type: String,
    enum: ["unpaid", "partial", "paid"],
    default: "unpaid",
  },
  date: { type: Date, default: Date.now },
});

const customerSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    index: true,
  },
  name: { type: String, required: true, unique: true },
  history: [transactionSchema],
});

export default mongoose.model("Customer", customerSchema);
