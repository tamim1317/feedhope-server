import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import foodRoutes from "./routes/foodRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// ✅ CORS configuration
const allowedOrigins = [
  "*"
  // "https://feedhope-client.vercel.app", // production frontend
  // "http://localhost:5173",             // development frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Handle preflight OPTIONS requests
app.options("*", cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/foods", foodRoutes);
app.use("/api/requests", requestRoutes);

// Fallback route for serverless function
app.get("/", (req, res) => {
  res.send("FeedHope Server is running 🚀");
});

// Serverless listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
