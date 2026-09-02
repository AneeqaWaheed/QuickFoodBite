import express from "express";
import { getModeratorStatusController, loginModerator, toggleModeratorStatus } from "../controllers/moderatorController.js";
import upload from "../middlewares/upload.js";
import { submitPaymentRequest } from "../controllers/PaymentRequestController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
const router = express.Router();

router.post("/login", loginModerator);
router.put("/status", toggleModeratorStatus);
router.get("/status/:userId", getModeratorStatusController);
router.post("/submit-payment", requireSignIn, upload.single("receipt"),submitPaymentRequest);

export default router;