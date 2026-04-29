import express from "express";
import { loginModerator } from "../controllers/moderatorController.js";

const router = express.Router();

router.post("/login", loginModerator);

export default router;