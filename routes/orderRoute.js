// routes/orderRoutes.js
import express from "express";
import { createOrder, getAllOrders,getSingleOrder, assignModerator,deleteOrder, updateOrderStatus } from "../controllers/orderController.js";

const router = express.Router();

router.post("/create-order", createOrder);

router.get("/all", getAllOrders);


router.get("/:id", getSingleOrder);


router.put("/status/:id", updateOrderStatus);


router.put("/assign/:id", assignModerator);


router.delete("/delete/:id", deleteOrder);
export default router;
