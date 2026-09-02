import Order from "../models/ordersModel.js";
import Product from "../models/productModel.js";

export const updateOrderItems = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Make sure this moderator owns the order
    if (
      !order.assignedModerator ||
      order.assignedModerator.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this order",
      });
    }

    // Delivered orders cannot be edited
    if (order.status === "delivered") {
      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be edited",
      });
    }

    const oldSubtotal = Number(order.subtotal || 0);
    const oldTotal = Number(order.total || 0);

    // Get product IDs
    const productIds = items.map((item) => item.productId);

    // Get products from database
    const products = await Product.find({
      _id: { $in: productIds },
    });

    if (products.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more selected products are unavailable",
      });
    }

    // Build updated items using DB prices
    const updatedItems = items.map((item) => {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        throw new Error("Invalid product quantity");
      }

      return {
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        quantity,
        category: product.category,
        type: product.type,
        discount: product.discount || 0,
      };
    });

    // Calculate new subtotal
    const newSubtotal = updatedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    // New subtotal cannot be lower
    if (newSubtotal < oldSubtotal) {
      return res.status(400).json({
        success: false,
        message: `Updated subtotal cannot be less than the previous subtotal of Rs.${oldSubtotal}`,
      });
    }

    // Detect changes
    const changes = [];

    const oldItems = order.items || [];

    updatedItems.forEach((newItem) => {
      const oldItem = oldItems.find(
        (item) =>
          item.productId?.toString() === newItem.productId.toString()
      );

      if (!oldItem) {
        changes.push({
          type: "added",
          productName: newItem.name,
          oldQuantity: 0,
          newQuantity: newItem.quantity,
        });
      } else if (Number(oldItem.quantity) !== newItem.quantity) {
        changes.push({
          type: "quantity_changed",
          productName: newItem.name,
          oldQuantity: oldItem.quantity,
          newQuantity: newItem.quantity,
        });
      }
    });

    oldItems.forEach((oldItem) => {
      const stillExists = updatedItems.some(
        (newItem) =>
          newItem.productId?.toString() === oldItem.productId?.toString()
      );

      if (!stillExists) {
        changes.push({
          type: "removed",
          productName: oldItem.name,
          oldQuantity: oldItem.quantity,
          newQuantity: 0,
        });
      }
    });

    if (changes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No changes were made",
      });
    }

    // Keep existing charges
    const deliveryCharges = Number(order.deliveryCharges || 0);
    const PackagingFee = Number(order.PackagingFee || 0);

    const newTotal =
      newSubtotal +
      deliveryCharges +
      PackagingFee;

    // Update order
    order.items = updatedItems;
    order.subtotal = newSubtotal;
    order.total = newTotal;

    // Save update history
    order.orderUpdates.push({
      updatedBy: req.user._id,
      changes,
      oldSubtotal,
      newSubtotal,
      oldTotal,
      newTotal,
    });

    await order.save();

    // WhatsApp message
    let whatsappMessage = `🔔 ORDER UPDATED\n\n`;

    whatsappMessage += `Hello ${order.userName},\n`;
    whatsappMessage += `Your order has been updated by the moderator.\n\n`;

    changes.forEach((change) => {
      if (change.type === "added") {
        whatsappMessage +=
          `➕ ${change.productName} × ${change.newQuantity}\n`;
      }

      if (change.type === "removed") {
        whatsappMessage +=
          `➖ ${change.productName} removed\n`;
      }

      if (change.type === "quantity_changed") {
        whatsappMessage +=
          `🔄 ${change.productName}: ${change.oldQuantity} → ${change.newQuantity}\n`;
      }
    });

    whatsappMessage += `\n━━━━━━━━━━━━━━\n`;
    whatsappMessage += `Subtotal: Rs.${newSubtotal}\n`;
    whatsappMessage += `Delivery: Rs.${deliveryCharges}\n`;
    whatsappMessage += `Packaging: Rs.${PackagingFee}\n`;
    whatsappMessage += `Total: Rs.${newTotal}\n`;
    whatsappMessage += `━━━━━━━━━━━━━━\n\n`;
    whatsappMessage += `Thank you!`;

    const phone = order.phone?.replace(/\D/g, "");

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(
          whatsappMessage
        )}`
      : null;

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
      changes,
      whatsappUrl,
    });
  } catch (error) {
    console.log("UPDATE ORDER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order",
    });
  }
};