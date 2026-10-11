import express from "express";


import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { getAllModeratorAvailabilitiesController, getAvailabilityController, saveAvailabilityController } from "../controllers/moderatorAvailabilityController.js";

const router = express.Router();

router.get(
  "/admin/all",
  requireSignIn,
  isAdmin,
  getAllModeratorAvailabilitiesController
);

// Get availability for selected date
router.get(
  "/:date", requireSignIn, getAvailabilityController
);


// Save / update availability
router.put(
  "/", requireSignIn, saveAvailabilityController
);


export default router;