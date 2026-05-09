import express from "express";
import { tokenController } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/token", tokenController);

export default router;
