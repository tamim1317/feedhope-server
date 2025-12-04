import express from "express";
import { getFoods, getMyFoods, addFood, updateFood, deleteFood } from "../controllers/foodController.js";

const router = express.Router();

// Router-level CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "https://feedhope-client.vercel.app");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

router.get("/", getFoods);
router.get("/my-foods", getMyFoods);
router.post("/", addFood);
router.put("/:id", updateFood);
router.delete("/:id", deleteFood);

export default router;
