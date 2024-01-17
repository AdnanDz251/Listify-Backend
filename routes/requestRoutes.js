import services from "../services/requestServices.js";
import express from "express"

const router = express.Router();

router.get("/getByCompanyId/:companyId", services.getByCompanyId);
router.get("/getById/:id", services.getById);
router.get("/getByUserId/:userId", services.getByUserId);
router.post("/add", services.add);
router.delete("/remove/:id", services.remove);
router.get("/getAll", services.getAll);

export default router;