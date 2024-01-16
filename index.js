import express from "express";
import userRoutes from './routes/userRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import countryRoutes from './routes/countryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import authJWT from './middleware/auth.middleware.js';
import cors from "cors";
import authJWT from './middleware/auth.middleware.js';
const app = express();
import dotenv from "dotenv";
import connect from "./dbConnect.js"

dotenv.config();

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('*', authJWT.verifyUserToken);

connect();

app.use("/api/users", userRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/country", countryRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/category", categoryRoutes);

app.listen(port, () =>{
  console.log(`Server is running on port: ${port}`);
});