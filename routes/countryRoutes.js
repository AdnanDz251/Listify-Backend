import services from "../services/countryServices.js";
import express from "express";
import authJWT from '../middleware/auth.middleware.js';

const router = express.Router();

//All Users
router.get("/getAll", authJWT.verifyUserToken, services.getAll);
router.get("/getByName/:name", authJWT.verifyUserToken, services.getByName);
router.get("/getById/:id", authJWT.verifyUserToken, services.getById)

export default router;