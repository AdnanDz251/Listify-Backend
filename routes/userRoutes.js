import services from "../services/userServices.js";
import express from "express";
import authJWT from '../middleware/auth.middleware.js';
import authAdmin from '../middleware/admin.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//No Authentication
router.post("/register", services.register);
router.post("/login", services.login);
router.get("/sendChangeMail/:user_id", services.sendChangeMail);
router.get("/sendAcceptanceMail/:email", services.sendAcceptanceMail);

//Yes Authentication
router.get("/getByName/:name", authJWT.verifyUserToken, services.getByName);
router.get("/getByEmail/:email", authJWT.verifyUserToken, services.getByEmail);
router.get("/getById/:id", authJWT.verifyUserToken, services.getById);
router.get("/getAdmitted", authJWT.verifyUserToken, services.getAdmitted);
router.patch("/update", authJWT.verifyUserToken, services.update);
router.post("/addUserImage", authJWT.verifyUserToken, upload.single('image'), services.addUserImage);

//For Admin Only
router.get("/getAll", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getAll);
router.get("/getByIsActive/:isActive", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.getByIsActive);
router.patch("/deactivate", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.deactivate);
router.patch("/promoteToAdmin/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.promoteToAdmin);
router.patch("/banUser/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.banUser);
router.patch("/joinCompany", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.joinCompany);
router.patch("/approveNewUser/:user_id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.approveNewUser);

//For Pinging Perposes
router.get("/info", services.info);

export default router;