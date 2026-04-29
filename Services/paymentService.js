// services/paymentService.js
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (items, userId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: { name: item.name },
          unit_amount: item.price * 100, // amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/success`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: { userId },
    });
    return session;
  } catch (error) {
    throw new Error("Failed to create Stripe session");
  }
};

export const handleWebhookEvent = async (event) => {
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;
      const { userId, totalAmount } = session.metadata;

      // Assuming an Order model where you can store completed orders
      const order = new Order({
        userId,
        items: session.display_items,
        totalAmount: session.amount_total / 100,
        status: "paid",
      });

      await order.save();
      return order;
    default:
      console.warn(`Unhandled event type: ${event.type}`);
  }
};
