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

//  CORS configuration

const allowedOrigins = [
  "http://localhost:5173",                  // local dev
  "https://feedhope-client.vercel.app",     // production frontend
  "https://feedhope-authentication.web.app",// firebase hosting
  "https://feedhopebd.netlify.app",         // netlify frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman, mobile apps, curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS Error: Origin not allowed"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));
// Handle preflight OPTIONS requests
// app.options("*", cors());
app.use(cors({
  origin: "*",
  credentials: true,
}));


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
