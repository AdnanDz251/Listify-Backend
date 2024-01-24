import services from "../services/reviewServices.js";
import express from "express"
import authJWT from '../middleware/auth.middleware.js';

const router = express.Router();

//All Users  
router.get("/getByCompany/:company", authJWT.verifyUserToken, services.getByCompany);
router.get("/getById/:id", authJWT.verifyUserToken, services.getById);
router.get("/getByUserId/:id", authJWT.verifyUserToken, services.getByUserId);
router.post("/add", authJWT.verifyUserToken, services.add);
router.delete("/remove/:id", authJWT.verifyUserToken, services.remove);
router.patch("/update", authJWT.verifyUserToken, services.update);

export default router;