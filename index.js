import express from "express";
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import cors from "cors";
const app = express();
import dotenv from "dotenv";
import connect from "./dbConnect.js"

dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.all('*', authJWT.verifyUserToken);

connect();

app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/group", groupRoutes);
app.use("/api/review", reviewRoutes);

app.listen(port, () =>{
  console.log(`Server is running on port: ${port}`);
});