// routes/orderRoutes.js
import express from "express";
import { createOrder, getAllOrders,getSingleOrder, assignModerator,deleteOrder, updateOrderStatus, claimOrder, getMyModeratorOrders } from "../controllers/orderController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import isModerator from "../middlewares/isModerator.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.get("/all-orders", getAllOrders);


// router.get("/:id", getSingleOrder);


router.put("/status/:id", updateOrderStatus);


router.put("/assign/:id", assignModerator);


router.delete("/delete/:id", deleteOrder);
router.put("/claim/:token", requireSignIn, claimOrder);
router.get("/my-orders", requireSignIn, getMyModeratorOrders);
export default router;
