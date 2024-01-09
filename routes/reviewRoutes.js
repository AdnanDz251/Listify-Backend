import services from "../services/reviewServices.js";
import express from "express"

const router = express.Router();

router.get("/getByCompany/:company", services.getByCompany);
router.get("/getById/:id", services.getById);
router.post("/add", services.add);
router.delete("/delet/:id", services.delet);
router.patch("/update", services.update);

export default router;