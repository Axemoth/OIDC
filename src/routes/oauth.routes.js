import express from "express";
import { authorizeController, consentController } from "../controllers/oauth.controller.js";

const router = express.Router();

router.get("/authorize", authorizeController);
router.post("/consent", consentController);

export default router;
