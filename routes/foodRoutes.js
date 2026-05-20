import express from "express";
import { getFoods, getMyFoods, addFood, updateFood, deleteFood } from "../controllers/foodController.js";

const router = express.Router();

// No need for router-level CORS anymore (handled globally in index.js)

// Public Routes
router.get("/", getFoods);                    // Get all foods
router.get("/my-foods", getMyFoods);          // Get user's foods

// Protected Routes
router.post("/", addFood);                    // Add new food
router.put("/:id", updateFood);               // Update food
router.delete("/:id", deleteFood);            // Delete food

export default router;