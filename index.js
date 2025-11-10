const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const mongoose = require('mongoose');
require('dotenv').config();


const app = express();

//Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

app.get("/", (req, res) => {
  res.send("FeedHope server is running...");
});


app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});