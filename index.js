const cors = require("cors");
const express = require("express");
const bodyParser = require('body-parser');
const authJWT = require('./middleware/authJWT')
const userRoutes = require('./routes/userRoutes');

const app = express()

require("dotenv").config();
const port = process.env.PORT || 5000;

require("./dbConnect.js");

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', authJWT.verifyUserToken);

app.use("/api/users", userRoutes);

app.listen(port, () =>{
  console.log(`Server is running on port: ${port}`);
});