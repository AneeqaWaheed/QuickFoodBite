import Order from "../models/ordersModel.js";
import { v4 as uuidv4 } from "uuid";
import userModel from "../models/userModel.js";
import admin from "../Services/firebase.js";
// 🔥 CREATE ORDER
// CREATE ORDER
export const createOrder = async (req, res) => {
   console.log("REQ BODY:", req.body);
  console.log("ORDER TYPE:", req.body.orderType);
  try {
    const {
      userId,
      orderType,

      // Common
      userName,
      phone,

      // Cafe
      items,
      location,
      subtotal,
      discountTotal,
      PackagingFee,

      // Other Service
      pickupPoint,
      deliveryPoint,
      category,
      description,
      specialNotes,

      // Common
      deliveryCharges,
      total,
      
    } = req.body;

    // ==========================================
    // COMMON VALIDATION
    // ==========================================

    if (!orderType || !["cafe", "service"].includes(orderType)) {
      return res.status(400).send({
        success: false,
        message: "Invalid order type",
      });
    }

    if (!userName?.trim()) {
      return res.status(400).send({
        success: false,
        message: "Name is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).send({
        success: false,
        message: "Phone number is required",
      });
    }

    // ==========================================
    // CAFE VALIDATION
    // ==========================================

    if (orderType === "cafe") {
      if (!items || items.length === 0) {
        return res.status(400).send({
          success: false,
          message: "Cart is empty",
        });
      }

      if (!location?.trim()) {
        return res.status(400).send({
          success: false,
          message: "Delivery location is required",
        });
      }
    }

    // ==========================================
    // OTHER SERVICE VALIDATION
    // ==========================================

    if (orderType === "service") {
      if (!pickupPoint?.trim()) {
        return res.status(400).send({
          success: false,
          message: "Pickup point is required",
        });
      }

      if (!deliveryPoint?.trim()) {
        return res.status(400).send({
          success: false,
          message: "Delivery point is required",
        });
      }

      if (!category?.trim()) {
        return res.status(400).send({
          success: false,
          message: "Service category is required",
        });
      }

      if (!description?.trim()) {
        return res.status(400).send({
          success: false,
          message: "Description is required",
        });
      }
    }

    // ==========================================
    // CREATE CLAIM TOKEN
    // ==========================================

    const token = uuidv4();

    // ==========================================
    // CREATE ORDER
    // ==========================================

    const order = await new Order({
      userId,
      orderType,

      userName,
      phone,

      // Cafe
      items: orderType === "cafe" ? items : [],
      location: orderType === "cafe" ? location : "",

      // Service
      pickupPoint: orderType === "service" ? pickupPoint : "",
      deliveryPoint: orderType === "service" ? deliveryPoint : "",
      category: orderType === "service" ? category : "",
      description: orderType === "service" ? description : "",
      specialNotes: orderType === "service" ? specialNotes : "",

      // Charges
      subtotal: subtotal || 0,
      discountTotal: discountTotal || 0,
      deliveryCharges: deliveryCharges || 0,
      PackagingFee: PackagingFee || 0,
      total: total || 0,

      // Moderator claim
      claimToken: token,
      isClaimed: false,

      // 10 minute claim window
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),

      status: "pending",
    }).save();

    console.log("✅ Order created:", order._id);

    // ==========================================
    // NOTIFY MODERATORS
    // ==========================================

    console.log("📡 Sending notification to moderators...");

    const moderators = await userModel.find({
  role: 0,
  isOnline: true,
  fcmToken: { $exists: true, $ne: null },
  lastSeen: {
    $gte: new Date(Date.now() - 2 * 60 * 1000),
  },
  $expr: {
    $lte: [
      {
        $add: [
          { $ifNull: ["$creditBalance", 0] },
          deliveryCharges || 0,
        ],
      },
      1000,
    ],
  },
});

    console.log("Moderators found:", moderators.length);

    for (const moderator of moderators) {
      if (!moderator.fcmToken) {
        continue;
      }

      try {
        // Notification text based on order type
        let notificationTitle = "";
        let notificationBody = "";

        if (orderType === "cafe") {
          notificationTitle = "🍔 New Cafe Order";
          notificationBody = `New cafe order for ${location}`;
        } else {
          notificationTitle = "🛍️ New Service Request";
          notificationBody = `${category} request from ${pickupPoint}`;
        }

        const response = await admin.messaging().send({
          token: moderator.fcmToken,

          notification: {
            title: notificationTitle,
            body: notificationBody,
          },

          webpush: {
            fcmOptions: {
              link: `${process.env.REACT_APP_CLIENT_URL}/dashboard/moderator/claim/${order._id}`,
            },
          },

          data: {
            orderId: order._id.toString(),
            orderType: orderType,
          },
        });

        console.log(
          `✅ Notification sent to moderator ${moderator._id}:`,
          response
        );
      } catch (err) {
        console.log(
          "❌ Notification Error:",
          err.code || err.message
        );

        console.log(
          "Moderator:",
          moderator._id
        );
      }
    }

    // ==========================================
    // RESPONSE
    // ==========================================

    return res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
      token,
    });

  } catch (error) {
    console.log("CREATE ORDER ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error creating order",
      error: error.message,
    });
  }
};


// 🔥 GET ALL ORDERS (Admin / Moderator)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.productId", "name price")
      .populate("assignedModerator", "firstName email")
      .sort({ createdAt: -1 });

    return res.status(200).send({
      success: true,
      orders,
    });

  } catch (error) {
    console.log("GET ALL ORDERS ERROR:", error);

    return res.status(500).send({
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

    const allowedStatuses = [
      "pending",
      "picked",
      "preparing",
      "purchasing",
      "on-the-way",
      "delivered",
      "cancelled",
      "expired",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).send({
        success: false,
        message: "Invalid order status",
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    await order.save();

    return res.status(200).send({
      success: true,
      message: "Order status updated",
      order,
    });

  } catch (error) {
    console.log("UPDATE STATUS ERROR:", error);

    return res.status(500).send({
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
// CLAIM ORDER
export const claimOrder = async (req, res) => {
  try {
    const { token } = req.params;

    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized",
      });
    }

   const order = await Order.findById(token);

    // ==========================================
    // ORDER NOT FOUND
    // ==========================================

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Invalid or expired order",
      });
    }

    // ==========================================
    // ALREADY CLAIMED
    // ==========================================

    if (order.isClaimed || order.assignedModerator) {
      return res.status(400).send({
        success: false,
        message: "Order has already been claimed",
      });
    }

    // ==========================================
    // EXPIRED
    // ==========================================

    if (
      order.expiresAt &&
      new Date() > new Date(order.expiresAt)
    ) {
      order.status = "expired";
      await order.save();

      return res.status(400).send({
        success: false,
        message: "This order has expired",
      });
    }

    // ==========================================
    // GET MODERATOR
    // ==========================================

    const moderator = await userModel.findById(req.user._id);

    if (!moderator) {
      return res.status(404).send({
        success: false,
        message: "Moderator not found",
      });
    }

    // ==========================================
    // CREDIT CHECK
    // ==========================================

    const currentCredits = moderator.creditBalance || 0;
    const deliveryCharge = order.deliveryCharges || 0;

    if (currentCredits + deliveryCharge > 1000) {
      return res.status(400).send({
        success: false,
        message: `You cannot claim this order. Your current credits are Rs. ${currentCredits} and this order has a delivery charge of Rs. ${deliveryCharge}. Your remaining limit is Rs. ${1000 - currentCredits}.`,
      });
    }

    moderator.creditBalance = currentCredits + deliveryCharge;
await moderator.save();

    // ==========================================
    // CLAIM ORDER
    // ==========================================

    order.assignedModerator = req.user._id;
    order.status = "picked";
    order.isClaimed = true;

    await order.save();

    return res.status(200).send({
      success: true,
      message: "Order assigned successfully",
      order,
    });

  } catch (error) {
    console.log("CLAIM ORDER ERROR:", error);

    return res.status(500).send({
      success: false,
      message: "Error claiming order",
      error: error.message,
    });
  }
};
export const getMyModeratorOrders = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).send({
        success: false,
        message: "Unauthorized - user not found",
      });
    }

    const orders = await Order.find({
      assignedModerator: req.user._id,
    })
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

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

export const trackOrder = async (req, res) => {
  console.log("Tracking ID:", req.params.id);
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).send({
        success: false,
        message: "Order not found",
      });
    }

    res.send({
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

export const getModeratorOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure this order belongs to this moderator
    if (
      !order.assignedModerator ||
      order.assignedModerator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.log("GET MODERATOR ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load order",
    });
  }
};

