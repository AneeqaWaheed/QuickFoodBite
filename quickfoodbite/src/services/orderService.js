import { toast } from "react-toastify";

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

  try {
    const { name, phone, location } = userInfo;

    if (!name || !phone || !location) {
      toast.error("Please Fill all fields");
      return;
    }

    if (!/^92\d{10}$/.test(phone)) {
      toast.error("Enter valid phone number");
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