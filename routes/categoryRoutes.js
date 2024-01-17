import services from "../services/categoryServices.js";
import express from "express"

const router = express.Router();

router.get("/getAll", services.getAll);
router.get("/getByName/:name", services.getByName);
router.post("/add", services.add);
router.delete("/remove/:id", services.remove);
router.patch("/update", services.update);

export default router;