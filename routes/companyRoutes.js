import services from "../services/companyServices.js";
import express from "express"

const router = express.Router();

router.post("/add", services.add);
router.get("/getAll", services.getAll);
router.get("/getByName/:name", services.getByName);
router.get("/getById/:id", services.getById);
router.get("/getByCountry/:country", services.getByCountry);
router.get("/getByGroup/:group", services.getByGroup);
router.patch("/update", services.update);
router.delete("/delet/:id", services.delet);

export default router;