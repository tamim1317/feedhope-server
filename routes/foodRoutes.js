import express from "express";
import {
  getFoods,
  getMyFoods,
  addFood,
  updateFood,
  deleteFood
} from "../controllers/foodController.js";

const router = express.Router();

router.get("/", getFoods);
router.get("/my-foods", getMyFoods);
router.post("/", addFood);
router.put("/:id", updateFood);
router.delete("/:id", deleteFood);

export default router;
