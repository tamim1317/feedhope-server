import mongoose from "mongoose";

const FoodRequestSchema = new mongoose.Schema({
  foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food', required: true, index: true },
  foodName: { type: String, required: true },
  foodImage: { type: String },
  requesterEmail: { type: String, required: true },
  requesterName: { type: String, required: true },
  requesterImage: { type: String },
  requestLocation: { type: String, required: true },
  whyNeedFood: { type: String, required: true },
  contactNo: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending', required: true },
  requestedAt: { type: Date, default: Date.now }
});

export default mongoose.model('FoodRequest', FoodRequestSchema);
