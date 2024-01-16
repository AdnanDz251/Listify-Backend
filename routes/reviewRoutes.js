import services from "../services/reviewServices.js";
import express from "express"

const router = express.Router();

router.get("/getByCompany/:company", services.getByCompany);
router.get("/getById/:id", services.getById);
router.get("/getByUserId/:id", services.getByUserId);
router.post("/add", services.add);
router.delete("/remove/:id", services.remove);
router.patch("/update", services.update);

export default router;