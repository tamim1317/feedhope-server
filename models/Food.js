import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Food", FoodSchema);
