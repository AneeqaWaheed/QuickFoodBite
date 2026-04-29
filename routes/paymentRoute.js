// routes/paymentRoutes.js
import express from "express";
import {
  confirmPayment,
  createCheckout,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

router.post("/checkout", verifyToken, createCheckout);
router.get("/status/:sessionId", confirmPayment);

// Stripe requires raw body to verify webhook signature

export default router;
