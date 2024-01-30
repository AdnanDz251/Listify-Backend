import services from "../services/requestServices.js";
import express from "express";
import authJWT from "../middleware/auth.middleware.js";
import authAdmin from "../middleware/admin.middleware.js";

const router = express.Router();

//All Users
router.post("/add", authJWT.verifyUserToken, services.add);

//Admin Only authAdmin.verifyAdmin,
router.get("/getByCompanyId/:companyId", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getByCompanyId);
router.get("/getById/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getById);
router.get("/getByUserId/:userId", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getByUserId);
router.delete("/remove/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.remove);
router.get("/getAll", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getAll);

export default router;