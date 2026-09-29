import express from "express";

import {
  getAllAdsController,
  getActiveAdsController,
  deleteAdController,
  toggleAdStatusController,
  createAdController,
} from "../controllers/AdsController.js";

import upload from "../middlewares/upload.js";

// Change these imports to match your existing auth middleware
import { requireSignIn, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

// PUBLIC
router.get("/active", getActiveAdsController);

// ADMIN
router.post(
  "/create",
  requireSignIn,
  isAdmin,
  upload.single("image"),
  createAdController
);

router.get(
  "/all",
  requireSignIn,
  isAdmin,
  getAllAdsController
);

router.delete(
  "/delete/:id",
  requireSignIn,
  isAdmin,
  deleteAdController
);

router.put(
  "/toggle/:id",
  requireSignIn,
  isAdmin,
  toggleAdStatusController
);

export default router;