const express = require("express");
const userRoutes = require('./routes/userRoutes');
const cors = require("cors");
const app = express()

require("dotenv").config();
const port = process.env.PORT || 5000;

require("./dbConnect.js");

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.listen(port, () =>{
  console.log(`Server is running on port: ${port}`);
});