// routes/chargesRoutes.js
import express from "express";
import {

  getCharges,
  updateCharge,
 
} from "../controllers/chargesController.js";
import{updateSettings, getSettings} from "../controllers/settingController.js"
const router = express.Router();
router.get("/all", getCharges);
router.put("/update/:id", updateCharge);
router.put("/updatesetting", updateSettings);
router.get("/getsetting", getSettings);
export default router;