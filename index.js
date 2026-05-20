require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// ====================== CORS CONFIGURATION ======================
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://feedhope-authentication.web.app",
  "https://feedhope-client.vercel.app",
  "https://feedhopebd.netlify.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log("🚫 Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight OPTIONS requests
app.options("*", cors());

// Body Parser
app.use(express.json());

// ====================== ROUTES ======================
const { MongoClient, ServerApiVersion } = require("mongodb");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("plateshare");        // Change to "feedhope" if you use different DB name
    console.log("✅ Successfully connected to MongoDB");

    // Import Routes
    const foodRoutes = require("./routes/foodRoutes")(db);
    const requestRoutes = require("./routes/requestRoutes")(db);

    // Use Routes with /api prefix (Recommended)
    app.use("/api/foods", foodRoutes);
    app.use("/api/requests", requestRoutes);

    // Health Check Route
    app.get("/", (req, res) => {
      res.json({
        status: "ok",
        message: "FeedHope Server is running successfully 🍽️",
        allowedOrigins: allowedOrigins
      });
    });

    // 404 Route
    app.use((req, res) => {
      res.status(404).json({ success: false, message: "Route not found" });
    });

    // Global Error Handler
    app.use((err, req, res, next) => {
      console.error("Server Error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    });

    // Start Server
    app.listen(PORT, () => {
      console.log(`🚀 FeedHope Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

run();