import Food from "../models/Food.js";

// All foods
export const getFoods = async (req, res) => {
  try { res.json(await Food.find()); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Foods by user
export const getMyFoods = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: "userId is required" });
  try { res.json(await Food.find({ userId })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Add food
export const addFood = async (req, res) => {
  try { res.json(await new Food(req.body).save()); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Update food
export const updateFood = async (req, res) => {
  try { res.json(await Food.findByIdAndUpdate(req.params.id, req.body, { new: true })); }
  catch (err) { res.status(500).json({ message: err.message }); }
};

// Delete food
export const deleteFood = async (req, res) => {
  try { await Food.findByIdAndDelete(req.params.id); res.json({ message: "Food deleted" }); }
  catch (err) { res.status(500).json({ message: err.message }); }
};
