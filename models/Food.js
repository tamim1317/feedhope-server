import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  quantity: { type: Number, required: true },
  location: { type: String },
  userId: { type: String }, // Firebase UID or custom userId
}, { timestamps: true });

export default mongoose.model("Food", FoodSchema);
