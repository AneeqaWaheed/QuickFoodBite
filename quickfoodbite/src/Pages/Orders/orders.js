import React from "react";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import "./orderStyle.css";
import { Button } from "react-bootstrap";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa6";

const CartPage = () => {
  const {
  cart,
  setCart,
  cartOpen,
  setCartOpen,
  increaseQty,
  decreaseQty,
  clearCart   // 🔥 ADD THIS
} = useCart();
  const [showModal, setShowModal] = useState(false);

const [userInfo, setUserInfo] = useState({
  name: "",
  phone: "",
  location: "",
});
const [settings, setSettings] = useState({});
const [charges, setCharges] = useState([]);
const [loading, setLoading] = useState(false);
const getId = (item) => item._id || item.id;
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/charges/getsetting`
    );

    setSettings(data || {});
    console.log("Min Order and GlobalDiscount: ", data)
  } catch (error) {
    console.log(error);
  }
};

const fetchCharges = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/charges/all`
    );

    if (data?.success) {
      setCharges(data.charges);
    }
    console.log("Chargesss:", data)
  } catch (error) {
    console.log(error);
  }
};
const round = (num) => Math.round(num);
const calculateSummary = () => {
  console.log("Settings: ",settings, settings?.minOrderPrice);
    let subtotal = 0;
    let itemDiscount = 0;
    let liquid = 0;
    let solid = 0;

    cart.forEach((item) => {
      const total = item.price * item.quantity;
      subtotal += total;

      if (item.discount) {
        itemDiscount += (total * item.discount) / 100;
      }

      if (item.type === "Liquid") 
        {liquid += item.quantity}
      else solid += item.quantity;
    });

    const deliveryLiquid =
      charges.find((c) => c.type === "delivery" && c.category === "Liquid")?.amount || 0;
    const deliverySolid =
      charges.find((c) => c.type === "delivery" && c.category === "Solid")?.amount || 0;

    const packagingLiquid =
      charges.find((c) => c.type === "packaging" && c.category === "Liquid")?.amount || 0;

    const packagingSolid =
      charges.find((c) => c.type === "packaging" && c.category === "Solid")?.amount || 0;

    const packagingCharge =  packagingSolid;
const liquidDeliveryTotal = liquid > 0 ? liquid * deliveryLiquid : 0;
const solidDeliveryTotal = solid > 0 ? deliverySolid : 0;

const calculatedDelivery = settings?.minOrderPrice
  ? (liquid > solid
      ? liquidDeliveryTotal + solidDeliveryTotal * 0.5
      : liquidDeliveryTotal + solidDeliveryTotal)
  : liquidDeliveryTotal + solidDeliveryTotal;
const minDelivery = subtotal * 0.17;

const isMinApplied = calculatedDelivery < minDelivery;

const deliveryCharge = round(isMinApplied
  ? minDelivery
  : calculatedDelivery);

    const globalDiscount = settings.globalDiscount || 0;
    const globalDiscountAmount = (subtotal * globalDiscount) / 100;

    const beforeTotal = subtotal - itemDiscount - globalDiscountAmount;

    const grandTotal = round(beforeTotal + deliveryCharge + packagingCharge);

    return {
        subtotal: round(subtotal),
  itemDiscount: round(itemDiscount),
  globalDiscountAmount: round(globalDiscountAmount),
      deliveryCharge,
      packagingCharge: round(packagingCharge),
      grandTotal,
      liquid,
      solid,
      finalTotal: round(subtotal),
      itemsCount: cart.length,
      isMinDeliveryApplied: isMinApplied, 
      deliveryLiquid
    };
  };

const handleProceed = async () => {
  if (loading) return;

setLoading(true);
  const { name, phone, location } = userInfo;

  if (!name || !phone || !location) {
    toast.error("Please Fill all of your information");
    return;
  }

  const summary = calculateSummary();
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

  try {
    // 🔥 1. SAVE ORDER IN DATABASE
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
    items: formattedItems, // ✅ MUST BE ARRAY
    total:summary.grandTotal,
    deliveryCharges:summary.deliveryCharge,
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


    // 🔥 2. OPTIONAL: WhatsApp message
  const message = `
🛒 *New Order Received*
*Location: *, ${location}

📦 *Items:*
${cart
  .map(
    (item) =>
      `• ${item.name} x${item.quantity} = Rs ${
        item.price * item.quantity
      } (Discount: ${item.discount || 0}%)`
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

  const encodedMessage = encodeURIComponent(message);

const isMobile = /Android|iPhone|iPad|iPod/i.test(
  navigator.userAgent
);

const whatsappURL = isMobile
  ? `whatsapp://send?phone=923265349097&text=${encodedMessage}`
  : `https://web.whatsapp.com/send?phone=923265349097&text=${encodedMessage}`;

window.location.href = whatsappURL;

    // 🔥 3. CLEAR CART
    clearCart();

    setShowModal(false);

    // toast.success("Order placed successfully!");

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
  finally {
  setLoading(false);
}
};
// ✅ fetch once on mount
useEffect(() => {
  fetchSettings();
  fetchCharges();
}, []);


  return (
  <>
    {/* OVERLAY */}
    {cartOpen && (
      <div
        className="cart-overlay"
        onClick={() => setCartOpen(false)}
      />
    )}

    {/* DRAWER */}
   <div className={`cart-drawer ${cartOpen ? "open" : ""}`}>
  
  {/* HEADER */}
  <div className="cart-header">
    <h5>Your Order ({cart.length})</h5>
    <button
      type="button"
      className="btn-close"
      onClick={() => setCartOpen(false)}
    ></button>
  </div>

  {/* SCROLLABLE BODY */}
  <div className="cart-body">
    {cart.length === 0 ? (
      <p className="text-center mt-4">Cart is empty</p>
    ) : (
      <>
        {cart.map((p) => (
          <div className="cart-items" key={getId(p)}>
            <div>
              <h6 className="fw-bold">{p.name}</h6>
              <p className="fw-light fs-6">
                Rs. {p.price} x {p.quantity}
              </p>
            </div>

            <div className="qty-container">
              <button
                className="qty-btn"
               onClick={() => decreaseQty(getId(p))}
              >
                −
              </button>

              <span className="qty-number">{p.quantity}</span>

              <button
                className="qty-btn"
               onClick={() => increaseQty(getId(p))}
              >
                +
              </button>
            </div>
          </div>
        ))}

        {/* USER FORM */}
        <div className="cart-form m-3">
          <h6>Enter Your Details</h6>

          <input
            type="text"
            placeholder="Name *"
            className="form-control mb-2"
            value={userInfo.name}
            onChange={(e) =>
              setUserInfo({ ...userInfo, name: e.target.value })
            }
          />

    <input
  type="text"
  placeholder="Phone (92XXXXXXXXXX) *"
  className="form-control mb-2"
  value={userInfo.phone}
  maxLength={12}
  onChange={(e) => {
    let value = e.target.value;

    // ✅ only digits allowed
    if (!/^\d*$/.test(value)) return;

    // ❌ must start with 92 (after first 2 digits)
    if (value.length === 1 && value !== "9") return;
    if (value.length === 2 && value !== "92") return;

    // ❌ block anything not starting with 92
    if (value.length >= 2 && !value.startsWith("92")) return;

    setUserInfo({ ...userInfo, phone: value });
  }}
/>

          <input
            type="text"
            placeholder="Location *"
            className="form-control"
            value={userInfo.location}
            onChange={(e) =>
              setUserInfo({ ...userInfo, location: e.target.value })
            }
          />
        </div>
      </>
    )}
  </div>

  {/* 🔥 FIXED SUMMARY FOOTER */}
  {cart.length > 0 && (
    <div className="cart-footer">
      {(() => {
        const s = calculateSummary();
        return (
          <>
            <div className="summary">
              <p>Subtotal <span>Rs {s.subtotal}</span></p>
              {s.itemDiscount !== 0 && (
                <p>Discount <span>-Rs {s.itemDiscount}</span></p>
              )}
              {s.globalDiscountAmount !== 0 && (
                <p>Global Discount <span>-Rs {s.globalDiscountAmount}</span></p>
              )}
              <p>
                <div>
  Delivery{" "}
  
  {s.liquid ?(
  <small style={{ color: "gray", marginLeft: "5px", display: "block" }}>
        (Liquid Delivery per item { s.deliveryLiquid} )
      </small>
  ) : null}
      </div>
  
<div>
  <div style={{ textAlign: "right" }}>
    <span>Rs {s.deliveryCharge}</span>
  </div>

  {s.isMinDeliveryApplied && (
    <small style={{ color: "gray", display: "block" }}>
      (17% maximum applied)
    </small>
  )}
</div>
</p>
              <p>Packaging <span>Rs {s.packagingCharge}</span></p>

              <h5>Total <span>Rs {s.grandTotal}</span></h5>
            </div>
<Button
  variant="danger"
  className="w-100 checkout-btn"
  onClick={() => {
    const minOrder = settings?.minOrderPrice ?? 0;

    if (s.subtotal < minOrder) {
      toast.error(`Minimum order is Rs ${minOrder}`);
      return;
    }

    if (!userInfo.name || !userInfo.phone || !userInfo.location) {
      toast.error("Please fill all fields");
      return;
    }

    setShowModal(true);
    setCartOpen(false);
  }}
>
  Proceed to Checkout
</Button>
          </>
        );
      })()}
    </div>
  )}
</div>

    {/* CHECKOUT MODAL */}
  {showModal && (
  <div
    className="modal fade show d-block"
    tabIndex="-1"
    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
  >
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content rounded-3 shadow">

        {/* HEADER */}
        <div className="modal-header border-0">
          <h5 className="modal-title fw-bold">
            We’re finding a moderator for your order 🍔
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setShowModal(false)}
          ></button>
        </div>

        {/* BODY */}
        <div className="modal-body text-center">

          <p className="mb-2">
            Please wait while your order is being picked by a moderator.
          </p>

          <p className="text-muted mb-2">
           Your order will be placed when you receive a confirmation message from the moderator
          </p>

          <p className="text-danger small">
            If not picked within 5 minutes, you can place your order again.
          </p>

        </div>

        {/* FOOTER */}
        <div className="modal-footer border-0 d-flex flex-column gap-2">

         <button
  className="btn btn-success w-100"
  onClick={handleProceed}
  disabled={loading}
>
  {loading ? "Processing..." : "Confirm Order via WhatsApp"}
</button>

          <button
            className="btn btn-outline-secondary w-100"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  </div>
)}
  </>
);
};


export default CartPage;
