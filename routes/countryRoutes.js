import services from "../services/countryServices.js";
import express from "express"

const router = express.Router();

router.get("/getAll", services.getAll);

export default router;