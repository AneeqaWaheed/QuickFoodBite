import express from "express";



import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";
import { approvePaymentRequest, getPaymentRequests, rejectPaymentRequest, updateModeratorCredits } from "../controllers/PaymentRequestController.js";
import { deleteUserController, toggleUserSuspensionController } from "../controllers/AdminController.js";

const router = express.Router();

// Admin
router.get(
  "/payment-requests",
  requireSignIn,
  isAdmin,
  getPaymentRequests
);

router.put(
  "/approve/:paymentId",
  requireSignIn,
  isAdmin,
  approvePaymentRequest
);

router.put(
  "/reject/:paymentId",
  requireSignIn,
  isAdmin,
  rejectPaymentRequest
);
router.put(
  "/moderator/:moderatorId/credits",
  requireSignIn,
  isAdmin,
  updateModeratorCredits
);
router.put(
  "/users/:id/toggle-suspension",
  requireSignIn,
  isAdmin,
  toggleUserSuspensionController
);

router.delete(
  "/users/:id",
  requireSignIn,
  isAdmin,
  deleteUserController
);
export default router;