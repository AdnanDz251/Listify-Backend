import services from "../services/companyServices.js";
import express from "express";
import authJWT from '../middleware/auth.middleware.js';
import authAdmin from '../middleware/admin.middleware.js';
import multer from 'multer';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

//All Users 
router.post("/add", authJWT.verifyUserToken, services.add);
router.get("/getAll", authJWT.verifyUserToken, services.getAll);
router.get("/getByName/:name", authJWT.verifyUserToken, services.getByName);
router.get("/getById/:id", authJWT.verifyUserToken, services.getById);
router.get("/getByCountry/:country", authJWT.verifyUserToken, services.getByCountry);
router.get("/getByGroup/:group", authJWT.verifyUserToken, services.getByGroup);
router.patch("/update", authJWT.verifyUserToken, services.update);
router.get("/getAllUsersInCompany/:companyId", authJWT.verifyUserToken, services.getAllUsersInCompany);
router.post("/addImageToCompany/:companyId", authJWT.verifyUserToken, upload.single('image'), services.addImageToCompany);

//Only Admin
router.delete("/remove/:id", authJWT.verifyUserToken, authAdmin.verifyAdmin, services.remove);

export default router;