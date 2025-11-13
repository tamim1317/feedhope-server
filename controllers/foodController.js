import Food from "../models/Food.js";

export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyFoods = async (req, res) => {
  try {
    const { userId } = req.query;
    const foods = await Food.find({ userId });
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addFood = async (req, res) => {
  try {
    const newFood = new Food(req.body);
    const savedFood = await newFood.save();
    res.json(savedFood);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateFood = async (req, res) => {
  try {
    const updated = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteFood = async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.id);
    res.json({ message: "Food deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
