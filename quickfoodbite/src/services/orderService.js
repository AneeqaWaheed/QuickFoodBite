
export const generateOrderNumber = () => {
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
  setFormError,
  navigate,
}) => {
  if (loading) return;

  setLoading(true);
const orderNumber = generateOrderNumber();
  try {
     const { name, phone, location } = userInfo;

    const minOrder = settings?.minOrderPrice || 0;
    
   const formattedItems = cart.map((item) => {
  const productId = item._id || item.id || item.productId;

  if (!productId) {
    console.error("❌ Cart item has no product ID:", item);

    throw new Error(`Product ID missing for "${item.name}"`);
  }

  return {
    productId,
    name: item.name,
    price: Number(item.price),
    quantity: Number(item.quantity),
    category: item.category,
    type: item.type,
    discount: Number(item.discount || 0),
  };
});

    const res = await fetch(
      `${process.env.REACT_APP_API}/api/v1/orders/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          orderType: "cafe",
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

      setFormError("Server Error. Please try again later")

      return;
    }

    const data = await res.json();

    if (!data?.success) {
      setFormError("Order failed. Please try again later")

      return;
    }
const orderId = data?.order?._id;
const orderToken = data.token;

console.log("Order ID:", orderId);
console.log("Navigate:", navigate);

clearCart();

setShowModal(false);

console.log("Navigating to:", `/orderTrack/${orderId}`);

navigate(`/orderTrack/${orderId}`);
  } catch (error) {
    console.log(error);

    setFormError("Something went Wrong, Please Try again later")
  } finally {
    setLoading(false);
  }
};

export default proceedOrder;