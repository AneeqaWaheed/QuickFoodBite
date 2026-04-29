import Stripe from "stripe";
import dotenv from "dotenv";
import Order from "../models/ordersModel.js";
import Product from "../models/productModel.js";
dotenv.config();

export const createCheckout = async (req, res) => {
  try {
    // Retrieve order details from local storage
    const { order, userId } = req.body;
    console.log("data from frontend", order, req.body);
    const totalAmount = order.reduce((sum, item) => {
      if (item.price && item.quantity) {
        return sum + item.price * item.quantity;
      }
      return sum;
    }, 0);
    if (!order || !Array.isArray(order) || order.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No order found" });
    }
    for (let i = 0; i < order.length; i++) {
      const prId = order[i]._id;
      const product = await Product.findById(prId);

      // Check if product exists
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `product with ID ${prId} not found`,
        });
      }

      const lineItems = order.map((bk) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(bk.price * 100),
          product_data: {
            name: bk.name,
           
          },
        },
        quantity: bk.quantity,
      }));

      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${process.env.REACT_ADDRESS}/checkout-success/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.REACT_ADDRESS}`,
        client_reference_id: prId,
        line_items: lineItems,
      });

      const orderData = {
        userId: userId,
        items: order.map((item) => ({
          productId: item._id,
          quantity: item.quantity, // Or the actual quantity if you have it
          price: item.price,
        })),
        totalAmount,
        createdAt: Date.now(),
        status: "pending",
        session: session.id,
      };
      const orderSaves = order.map(async (bk) => {
        // ... (prepare order data as before)
        const neworder = new Order(orderData);
        return await neworder.save();
      });

      await Promise.all(orderSaves);
      return res.status(200).json({
        success: true,
        message: "Successfully paid",
        session,
        id: session.id,
      });
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Error creating checkout session" });
  }
};

export const confirmPayment = async (req, res) => {
  const { sessionId } = req.params; // Use req.params instead of req.body
  console.log("adnasbdna", req.params);
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  try {
    // Retrieve the payment session using the sessionId from the URL
    const paymentStatus = await stripe.checkout.sessions.retrieve(sessionId);

    console.log("Payment Status Retrieved:", paymentStatus); // Debugging log

    if (paymentStatus.payment_status === "paid") {
      res.status(200).json({ success: true, paymentStatus });
    } else {
      res.status(200).json({ success: false, paymentStatus });
    }
  } catch (error) {
    console.error("Error retrieving payment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
