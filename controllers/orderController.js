import Order from "../models/ordersModel.js";
import { v4 as uuidv4 } from "uuid";

// 🔥 CREATE ORDER
export const createOrder = async (req, res) => {

  try {
    const {
      userId,
      items,
      subtotal,
      discountTotal,
      total,
      userName,
      phone,
      location,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).send({
        success: false,
        message: "Cart is empty",
      });
    }
const token = uuidv4();
    const order = await new Order({
      userId,
      items,
      subtotal,
      discountTotal,
      total,
      userName,
      phone,
      location,
       claimToken: token,
    }).save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
       token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error creating order",
    });
  }
};



// 🔥 GET ALL ORDERS (Admin / Moderator)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId", "name price")
      .populate("assignedModerator", "name email")
      .sort({ createdAt: -1 });

    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching orders",
    });
  }
};



// 🔥 GET SINGLE ORDER
export const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    res.status(200).send({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error fetching order",
    });
  }
};



// 🔥 UPDATE STATUS (Moderator)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Order status updated",
      order,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error updating status",
    });
  }
};



// 🔥 ASSIGN MODERATOR
export const assignModerator = async (req, res) => {
  try {
    const { moderatorId } = req.body;

    const order = await Order.findById(req.params.id);

    // ❌ Order not found
    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    // ❌ Already picked by someone else
    if (order.status !== "pending") {
      return res.status(400).send({
        success: false,
        message: "Order already picked by another moderator",
      });
    }

    // ❌ Expired (10 minutes)
    const TEN_MIN = 10 * 60 * 1000;
    if (Date.now() - new Date(order.createdAt).getTime() > TEN_MIN) {
      return res.status(400).send({
        success: false,
        message: "Order expired",
      });
    }

    // ✅ Assign moderator
    order.assignedModerator = moderatorId;
    order.status = "picked";

    await order.save();

    res.status(200).send({
      success: true,
      message: "Order assigned successfully",
      order,
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error assigning moderator",
    });
  }
};


// 🔥 DELETE ORDER (optional)
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error deleting order",
    });
  }
};
export const claimOrder = async (req, res) => {
  try {
    const { token } = req.params;

    const order = await Order.findOneAndUpdate(
      {
        claimToken: token,
        assignedModerator: null,
        isClaimed: false, // ✅ extra safety
      },
      {
        assignedModerator: req.user._id,
        status: "picked",
        isClaimed: true, // ✅ boolean
      },
      {
        new: true, // ✅ return updated doc
      }
    );

    if (!order) {
      return res.status(400).send({
        success: false,
        message: "Order already taken or invalid token",
      });
    }

    return res.send({
      success: true,
      message: "Order assigned successfully",
      order,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error claiming order",
    });
  }
};
export const getMyModeratorOrders = async (req, res) => {
  console.log("USER:", req.user);
  try {

    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    const orders = await Order.find({
      assignedModerator: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      orders,
    });

  } catch (error) {
    console.log("MY ORDERS ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Server error in my-orders",
      error: error.message,
    });
  }
};