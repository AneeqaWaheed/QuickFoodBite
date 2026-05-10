import { toast } from "react-toastify";
const generateOrderNumber = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";

  let result = "";

  // 3 random letters
  for (let i = 0; i < 3; i++) {
    result += letters[Math.floor(Math.random() * letters.length)];
  }

  // 3 random numbers
  for (let i = 0; i < 3; i++) {
    result += numbers[Math.floor(Math.random() * numbers.length)];
  }

  return result;
};
const proceedOrder = async ({
  loading,
  setLoading,
  userInfo,
  settings,
  cart,
  summary,
  clearCart,
  setShowModal,
  getId,
}) => {
  if (loading) return;

  setLoading(true);
const orderNumber = generateOrderNumber();
  try {
    const { name, phone, location } = userInfo;

    if (!name || !phone || !location) {
      toast.error("Please Fill all fields");
      return;
    }

    const minOrder = settings?.minOrderPrice || 0;

    if (summary.subtotal < minOrder) {
      toast.error(`Minimum order is Rs ${minOrder}`);
      return;
    }

    const formattedItems = cart.map((item) => ({
      productId: getId(item),
      name: item.name,
      price: Number(item.price),
      quantity: Number(item.quantity),
      category: item.category,
      type: item.type,
      discount: Number(item.discount || 0),
    }));

    const res = await fetch(
      `${process.env.REACT_APP_API}/api/v1/orders/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userName: name,
          phone,
          location,
          items: formattedItems,
          total: summary.grandTotal,
          deliveryCharges: summary.deliveryCharge,
          PackagingFee: summary.packagingCharge,
          ...summary,
        }),
      }
    );

    if (!res.ok) {
      const text = await res.text();

      console.log("Server Error:", text);

      toast.error("Server error. Please try again.");

      return;
    }

    const data = await res.json();

    if (!data?.success) {
      toast.error(data?.message || "Order failed");

      return;
    }

    const orderToken = data.token;

    const message = `
🧾 *ORDER #: ${orderNumber}*
🛒 *New Order Received*
*Location:* ${location}

📦 *Items:*
${cart
  .map(
    (item) =>
      `• ${item.name} x${item.quantity} = Rs ${
        item.price * item.quantity
      }`
  )
  .join("\n")}

📊 *Summary:*

Subtotal: Rs ${summary.subtotal}
${summary.itemDiscount !== 0 ? `Item Discount: -Rs ${summary.itemDiscount}\n` : ""}
${summary.globalDiscountAmount !== 0 ? `Global Discount: -Rs ${summary.globalDiscountAmount}\n` : ""}
Delivery: Rs ${summary.deliveryCharge}
Packaging: Rs ${summary.packagingCharge}

💰 TOTAL: Rs ${summary.grandTotal}

👉 *Pick Order Link:*
${process.env.REACT_APP_CLIENT_URL}/dashboard/moderator/claim/${orderToken}
`;

    const encodedMessage =
      encodeURIComponent(message);

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(
        navigator.userAgent
      );

    const whatsappURL = isMobile
      ? `whatsapp://send?phone=923265349097&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=923265349097&text=${encodedMessage}`;

    clearCart();

    setShowModal(false);

    window.location.href = whatsappURL;
  } catch (error) {
    console.log(error);

    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};

export default proceedOrder;