import Order from "../models/ordersModel.js";


// 🔥 CREATE ORDER
export const createOrder = async (req, res) => {
  console.log(Order.schema.paths.items);
  console.log("REQ BODY:", req.body);
  console.log("ITEMS TYPE:", typeof req.body.items);
  console.log("IS ARRAY:", Array.isArray(req.body.items));
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

    const order = await new Order({
      userId,
      items,
      subtotal,
      discountTotal,
      total,
      userName,
      phone,
      location,
    }).save();

    res.status(201).send({
      success: true,
      message: "Order placed successfully",
      order,
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

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { assignedModerator: moderatorId },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Moderator assigned",
      order,
    });
  } catch (error) {
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