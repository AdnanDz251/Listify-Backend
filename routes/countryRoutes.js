import services from "../services/countryServices.js";
import express from "express"

const router = express.Router();

router.get("/getAll", services.getAll);
router.get("/getByName/:name", services.getByName);

export default router;