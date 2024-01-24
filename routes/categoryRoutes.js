import services from "../services/categoryServices.js";
import express from "express";
import authJWT from '../middleware/auth.middleware.js';
import authAdmin from '../middleware/admin.middleware.js';

const router = express.Router();

//All Users
router.get("/getAll", authJWT.verifyUserToken, services.getAll);
router.get("/getByName/:name", authJWT.verifyUserToken, services.getByName);

//Only Admin 
router.post("/add", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.add);
router.delete("/remove/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.remove);
router.patch("/update", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.update);

export default router;