import mongoose, { Schema } from "mongoose";

const utangSchema = new mongoose.Schema({
  product: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
});

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  history: [utangSchema],
});

export default mongoose.model("Customer", customerSchema);
