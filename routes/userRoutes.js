import services from "../services/userServices.js";
import express from "express";

const router = express.Router();

router.post("/register", services.register);
router.post("/login", services.login);
router.get("/getAll", services.getAll);
router.get("/getByName/:name", services.getByName);
router.get("/getByEmail/:email", services.getByEmail);
router.get("/getById/:id", services.getById);
router.get("/getByIsActive/:isActive", services.getByIsActive);
router.get("/getAdmitted", services.getAdmitted);
router.patch("/update", services.update);
router.patch("/deactivate", services.deactivate);
router.patch("/promoteToAdmin/:id", services.promoteToAdmin);
router.patch("/banUser/:id", services.banUser);
router.patch("/joinCompany", services.joinCompany);

export default router;