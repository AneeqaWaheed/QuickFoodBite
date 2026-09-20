import Order from "../models/ordersModel.js";
import Product from "../models/productModel.js";

export const updateOrderItems = async (req, res) => {
  console.log("\n");
  console.log("=================================================");
  console.log("          UPDATE ORDER ITEMS START");
  console.log("=================================================");

  try {
    // =================================================
    // 1. REQUEST DATA
    // =================================================

    const { orderId } = req.params;
    const { items } = req.body;

    console.log("\n========== 1. REQUEST DATA ==========");
    console.log("Order ID:", orderId);
    console.log("Order ID type:", typeof orderId);
    console.log("User ID:", req.user?._id);
    console.log("User object:", req.user);
    console.log("Items:", JSON.stringify(items, null, 2));
    console.log("Items type:", typeof items);
    console.log("Items is Array:", Array.isArray(items));
    console.log("Items length:", items?.length);


    // =================================================
    // 2. VALIDATE ITEMS
    // =================================================

    console.log("\n========== 2. VALIDATE ITEMS ==========");

    if (!Array.isArray(items) || items.length === 0) {
      console.log("❌ 400: EMPTY ITEMS");

      return res.status(400).json({
        success: false,
        message: "Order must contain at least one item",
      });
    }

    console.log("✅ Items validation passed");


    // =================================================
    // 3. AUTHENTICATION
    // =================================================

    console.log("\n========== 3. AUTHENTICATION ==========");

    if (!req.user?._id) {
      console.log("❌ 401: USER NOT AUTHENTICATED");

      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    console.log("✅ User authenticated");
    console.log("Authenticated User ID:", req.user._id);


    // =================================================
    // 4. FIND ORDER
    // =================================================

    console.log("\n========== 4. FIND ORDER ==========");

    console.log("Searching Order with ID:", orderId);

    const order = await Order.findById(orderId);

    if (!order) {
      console.log("❌ 404: ORDER NOT FOUND");
      console.log("Searched ID:", orderId);

      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    console.log("✅ Order found");

    console.log("Order _id:", order._id);
    console.log("Order status:", order.status);
    console.log("Order assignedModerator:", order.assignedModerator);
    console.log("Order userName:", order.userName);
    console.log("Order phone:", order.phone);


    // =================================================
    // 5. CHECK MODERATOR OWNERSHIP
    // =================================================

    console.log("\n========== 5. MODERATOR OWNERSHIP ==========");

    console.log(
      "Order assignedModerator:",
      order.assignedModerator?.toString()
    );

    console.log(
      "Logged-in moderator:",
      req.user._id?.toString()
    );

    if (
      !order.assignedModerator ||
      order.assignedModerator.toString() !== req.user._id.toString()
    ) {
      console.log("❌ 403: MODERATOR DOES NOT OWN ORDER");

      console.log(
        "Assigned Moderator:",
        order.assignedModerator?.toString()
      );

      console.log(
        "Current User:",
        req.user._id?.toString()
      );

      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this order",
      });
    }

    console.log("✅ Moderator ownership verified");


    // =================================================
    // 6. CHECK ORDER STATUS
    // =================================================

    console.log("\n========== 6. ORDER STATUS ==========");

    console.log("Current order status:", order.status);

    if (order.status === "delivered") {
      console.log("❌ 400: ORDER IS DELIVERED");

      return res.status(400).json({
        success: false,
        message: "Delivered orders cannot be edited",
      });
    }

    console.log("✅ Order can be edited");


    // =================================================
    // 7. OLD ORDER VALUES
    // =================================================

    console.log("\n========== 7. OLD ORDER VALUES ==========");

    const oldSubtotal = Number(order.subtotal || 0);
    const oldTotal = Number(order.total || 0);

    const oldItems = order.items || [];

    console.log("Old subtotal:", oldSubtotal);
    console.log("Old total:", oldTotal);
    console.log("Old items count:", oldItems.length);

    console.log(
      "OLD ITEMS:",
      JSON.stringify(oldItems, null, 2)
    );


    // =================================================
    // 8. RECEIVED PRODUCT IDS
    // =================================================

    console.log("\n========== 8. PRODUCT IDS ==========");

    const productIds = items.map((item) => item.productId);

    console.log("Product IDs received:", productIds);
    console.log("Product ID count:", productIds.length);

    productIds.forEach((id, index) => {
      console.log(
        `Product ${index + 1}:`,
        id,
        "| type:",
        typeof id
      );
    });


    // =================================================
    // 9. CHECK DUPLICATE PRODUCT IDS
    // =================================================

    console.log("\n========== 9. DUPLICATE CHECK ==========");

    const uniqueProductIds = [
      ...new Set(productIds.map((id) => id?.toString())),
    ];

    console.log("Unique product IDs:", uniqueProductIds);
    console.log("Unique count:", uniqueProductIds.length);
    console.log("Received count:", productIds.length);

    if (uniqueProductIds.length !== productIds.length) {
      console.log("⚠️ DUPLICATE PRODUCT IDs FOUND");
    } else {
      console.log("✅ No duplicate product IDs");
    }


    // =================================================
    // 10. GET PRODUCTS FROM DATABASE
    // =================================================

    console.log("\n========== 10. DATABASE PRODUCTS ==========");

    console.log(
      "Searching Product collection for:",
      uniqueProductIds
    );

    const products = await Product.find({
      _id: { $in: uniqueProductIds },
    });

    console.log("Products found:", products.length);

    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log("_id:", product._id);
      console.log("name:", product.name);
      console.log("price:", product.price);
      console.log("category:", product.category);
      console.log("type:", product.type);
      console.log("discount:", product.discount);
    });


    // =================================================
    // 11. CHECK MISSING PRODUCTS
    // =================================================

    console.log("\n========== 11. MISSING PRODUCTS CHECK ==========");

    const missingProducts = uniqueProductIds.filter(
      (id) =>
        !products.some(
          (product) =>
            product._id.toString() === id.toString()
        )
    );

    console.log("Missing product IDs:", missingProducts);
    console.log("Missing count:", missingProducts.length);

    if (missingProducts.length > 0) {
      console.log("❌ 400: PRODUCTS NOT FOUND");

      return res.status(400).json({
        success: false,
        message: "One or more selected products are unavailable",
        missingProducts,
      });
    }

    console.log("✅ All products found");


    // =================================================
    // 12. BUILD UPDATED ITEMS
    // =================================================

    console.log("\n========== 12. BUILD UPDATED ITEMS ==========");

    const updatedItems = items.map((item, index) => {
      console.log(`\nProcessing item ${index + 1}`);
      console.log("Incoming item:", item);

      const product = products.find(
        (p) =>
          p._id.toString() ===
          item.productId.toString()
      );

      if (!product) {
        console.log("❌ Product not found:", item.productId);
        throw new Error("Product not found");
      }

      const quantity = Number(item.quantity);

      console.log("Product found:", product.name);
      console.log("DB price:", product.price);
      console.log("Incoming quantity:", item.quantity);
      console.log("Converted quantity:", quantity);

      if (!Number.isInteger(quantity) || quantity <= 0) {
        console.log("❌ INVALID QUANTITY");

        throw new Error("Invalid product quantity");
      }

      const updatedItem = {
        productId: product._id,
        name: product.name,
        price: Number(product.price),
        quantity,
        category: product.category,
        type: product.type,
        discount: product.discount || 0,
      };

      console.log("Updated item:", updatedItem);

      return updatedItem;
    });

    console.log(
      "\nFINAL UPDATED ITEMS:",
      JSON.stringify(updatedItems, null, 2)
    );


    // =================================================
    // 13. CALCULATE NEW SUBTOTAL
    // =================================================

    console.log("\n========== 13. SUBTOTAL CALCULATION ==========");

    const newSubtotal = updatedItems.reduce(
      (sum, item) => {
        const itemTotal =
          item.price * item.quantity;

        console.log(
          `${item.name}: ${item.price} × ${item.quantity} = ${itemTotal}`
        );

        return sum + itemTotal;
      },
      0
    );

    console.log("OLD SUBTOTAL:", oldSubtotal);
    console.log("NEW SUBTOTAL:", newSubtotal);
    console.log(
      "SUBTOTAL DIFFERENCE:",
      newSubtotal - oldSubtotal
    );


    // =================================================
    // 14. CHECK SUBTOTAL
    // =================================================

    console.log("\n========== 14. SUBTOTAL VALIDATION ==========");

    if (newSubtotal < oldSubtotal) {
      console.log("❌ 400: NEW SUBTOTAL IS LOWER");

      return res.status(400).json({
        success: false,
        message: `Updated subtotal cannot be less than the previous subtotal of Rs.${oldSubtotal}`,
      });
    }

    console.log("✅ Subtotal validation passed");


    // =================================================
    // 15. DETECT CHANGES
    // =================================================

    console.log("\n========== 15. CHANGE DETECTION ==========");

    const changes = [];

    console.log(
      "Comparing OLD items with NEW items..."
    );

    updatedItems.forEach((newItem) => {
      console.log("\nChecking new item:", newItem.name);
      console.log("New product ID:", newItem.productId);
      console.log("New quantity:", newItem.quantity);

      const oldItem = oldItems.find(
        (item) =>
          item.productId?.toString() ===
          newItem.productId.toString()
      );

      if (!oldItem) {
        console.log("➡️ PRODUCT ADDED");

        changes.push({
          type: "added",
          productName: newItem.name,
          oldQuantity: 0,
          newQuantity: newItem.quantity,
        });
      } else {
        console.log("Old quantity:", oldItem.quantity);
        console.log("New quantity:", newItem.quantity);

        if (
          Number(oldItem.quantity) !==
          newItem.quantity
        ) {
          console.log("➡️ QUANTITY CHANGED");

          changes.push({
            type: "quantity_changed",
            productName: newItem.name,
            oldQuantity: oldItem.quantity,
            newQuantity: newItem.quantity,
          });
        } else {
          console.log("➡️ NO CHANGE");
        }
      }
    });


    // =================================================
    // 16. DETECT REMOVED ITEMS
    // =================================================

    console.log("\n========== 16. REMOVED ITEMS ==========");

    oldItems.forEach((oldItem) => {
      const stillExists = updatedItems.some(
        (newItem) =>
          newItem.productId?.toString() ===
          oldItem.productId?.toString()
      );

      console.log(
        "Old item:",
        oldItem.name,
        "| still exists:",
        stillExists
      );

      if (!stillExists) {
        console.log("➡️ PRODUCT REMOVED");

        changes.push({
          type: "removed",
          productName: oldItem.name,
          oldQuantity: oldItem.quantity,
          newQuantity: 0,
        });
      }
    });


    // =================================================
    // 17. FINAL CHANGES
    // =================================================

    console.log("\n========== 17. FINAL CHANGES ==========");

    console.log(
      "Changes:",
      JSON.stringify(changes, null, 2)
    );

    console.log("Changes count:", changes.length);

    if (changes.length === 0) {
      console.log("❌ 400: NO CHANGES WERE MADE");

      return res.status(400).json({
        success: false,
        message: "No changes were made",
      });
    }

    console.log("✅ Changes detected");


    // =================================================
    // 18. DELIVERY + PACKAGING
    // =================================================

    console.log("\n========== 18. CHARGES ==========");

    const deliveryCharges = Number(
      order.deliveryCharges || 0
    );

    const PackagingFee = Number(
      order.PackagingFee || 0
    );

    console.log(
      "Delivery charges:",
      deliveryCharges
    );

    console.log(
      "Packaging fee:",
      PackagingFee
    );


    // =================================================
    // 19. NEW TOTAL
    // =================================================

    console.log("\n========== 19. TOTAL CALCULATION ==========");

    const newTotal =
      newSubtotal +
      deliveryCharges +
      PackagingFee;

    console.log("New subtotal:", newSubtotal);
    console.log("Delivery:", deliveryCharges);
    console.log("Packaging:", PackagingFee);
    console.log("NEW TOTAL:", newTotal);
    console.log("OLD TOTAL:", oldTotal);


    // =================================================
    // 20. UPDATE ORDER
    // =================================================

    console.log("\n========== 20. UPDATE ORDER ==========");

    order.items = updatedItems;
    order.subtotal = newSubtotal;
    order.total = newTotal;

    console.log("Order items updated in memory");
    console.log("Order subtotal updated:", order.subtotal);
    console.log("Order total updated:", order.total);


    // =================================================
    // 21. ORDER UPDATE HISTORY
    // =================================================

    console.log("\n========== 21. ORDER HISTORY ==========");

    const updateHistory = {
      updatedBy: req.user._id,
      changes,
      oldSubtotal,
      newSubtotal,
      oldTotal,
      newTotal,
    };

    console.log(
      "Update history:",
      JSON.stringify(updateHistory, null, 2)
    );

    order.orderUpdates.push(updateHistory);

    console.log("Order history pushed");


    // =================================================
    // 22. SAVE
    // =================================================

    console.log("\n========== 22. SAVING ORDER ==========");

    await order.save();

    console.log("✅ ORDER SAVED SUCCESSFULLY");


    // =================================================
    // 23. WHATSAPP MESSAGE
    // =================================================

    console.log("\n========== 23. WHATSAPP ==========");

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

    console.log("WhatsApp message:");
    console.log(whatsappMessage);


    // =================================================
    // 24. PHONE
    // =================================================

    console.log("\n========== 24. PHONE ==========");

    const phone = order.phone?.replace(/\D/g, "");

    console.log("Original phone:", order.phone);
    console.log("Clean phone:", phone);


    // =================================================
    // 25. WHATSAPP URL
    // =================================================

    const whatsappUrl = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(
          whatsappMessage
        )}`
      : null;

    console.log("WhatsApp URL exists:", !!whatsappUrl);


    // =================================================
    // 26. SUCCESS RESPONSE
    // =================================================

    console.log("\n========== 26. SUCCESS ==========");

    console.log("Returning updated order...");
    console.log("Order ID:", order._id);
    console.log("Final subtotal:", order.subtotal);
    console.log("Final total:", order.total);
    console.log("Changes:", changes.length);

    console.log("\n=================================================");
    console.log("          UPDATE ORDER ITEMS SUCCESS");
    console.log("=================================================\n");

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
      changes,
      whatsappUrl,
    });

  } catch (error) {

    // =================================================
    // ERROR
    // =================================================

    console.log("\n");
    console.log("=================================================");
    console.log("          ❌ UPDATE ORDER ITEMS ERROR");
    console.log("=================================================");

    console.log("Error name:", error.name);
    console.log("Error message:", error.message);
    console.log("Error code:", error.code);
    console.log("Error:", error);

    console.log("Stack:");
    console.log(error.stack);

    console.log("=================================================\n");

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to update order",
    });
  }
};