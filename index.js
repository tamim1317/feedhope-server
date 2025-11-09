const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 5000;
require('dotenv').config();


const app = express();

//Middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('FeedHope Server Running');
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});