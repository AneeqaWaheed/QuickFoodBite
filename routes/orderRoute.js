// routes/orderRoutes.js
import express from "express";
import { createOrder, getAllOrders,getSingleOrder, assignModerator,deleteOrder, updateOrderStatus, claimOrder, getMyModeratorOrders, trackOrder, getModeratorOrder } from "../controllers/orderController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import isModerator from "../middlewares/isModerator.js";
import { updateOrderItems } from "../controllers/UpdateOrderItemController.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.get("/all-orders", getAllOrders);


router.get("/track/:id", trackOrder);


router.put("/status/:id", updateOrderStatus);


router.put("/assign/:id", assignModerator);


router.delete("/delete/:id", deleteOrder);
router.put("/claim/:token", requireSignIn, claimOrder);
router.get("/my-orders", requireSignIn, getMyModeratorOrders);
router.delete("/delete/:orderId",requireSignIn,deleteOrder);
router.get(
  "/order/:orderId",
  requireSignIn,
  getModeratorOrder
);
router.put(
  "/update-items/:orderId",
  requireSignIn,
  updateOrderItems
);

export default router;
