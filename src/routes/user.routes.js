import express from "express";
import { userInfoController } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/userinfo", userInfoController);

export default router;
