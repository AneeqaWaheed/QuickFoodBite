
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import { useAuth } from "../../context/auth";
import "./orderStyle.css";
import { Button } from "react-bootstrap";
import { useState, react,useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa6";

const CartPage = ({ show, onClose }) => {
  const { cart, setCart, cartOpen, setCartOpen, increaseQty, decreaseQty   } = useCart();
  const [auth] = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [OrderPrice, setOrderPrice] = useState();
const [userInfo, setUserInfo] = useState({
  name: "",
  phone: "",
  location: "",
});
const [settings, setSettings] = useState({});
const [charges, setCharges] = useState([]);
  const removecart = async (pid) => {
    try {
      let mycart = [...cart];
      let index = mycart.findIndex((item) => item._id === pid);
      mycart.splice(index, 1);
      setCart(mycart);
      localStorage.setItem("cart", JSON.stringify(mycart));
    } catch (error) {
      console.log(error);
    }
  };
const fetchSettings = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.React_App_API}/api/v1/charges/getsetting`
    );

    setSettings(data || {});
  } catch (error) {
    console.log(error);
  }
};

const fetchCharges = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.React_App_API}/api/v1/charges/all`
    );

    if (data?.success) {
      setCharges(data.charges);
    }
  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {
  fetchSettings();
  fetchCharges();
}, []);
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        if (item.price && item.quantity) {
          total += item.price * item.quantity;
        }
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      });
    } catch (error) {
      console.log(error);
      return "$0.00";
    }
  };

const calculateSummary = () => {
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

      if (item.type === "liquid") liquid += item.quantity;
      else solid += item.quantity;
    });

    const deliveryLiquid =
      charges.find((c) => c.type === "delivery"&& c.category === "liquid")?.amount || 0;
    const deliverySolid =
      charges.find((c) => c.type === "delivery"&& c.category === "Solid")?.amount || 0;

    const packagingLiquid =
      charges.find((c) => c.type === "packaging" && c.category === "liquid")?.amount || 0;

    const packagingSolid =
      charges.find((c) => c.type === "packaging" && c.category === "Solid")?.amount || 0;

    const packagingCharge = liquid * packagingLiquid + solid * packagingSolid;
    const deliveryCharge = liquid * deliveryLiquid + solid * deliverySolid;

    const globalDiscount = settings.globalDiscount || 0;
    const globalDiscountAmount = (subtotal * globalDiscount) / 100;

    const beforeTotal = subtotal - itemDiscount - globalDiscountAmount;

    const grandTotal = beforeTotal + deliveryCharge + packagingCharge;

    return {
      subtotal,
      itemDiscount,
      globalDiscountAmount,
      deliveryCharge,
      packagingCharge,
      grandTotal,
      liquid,
      solid,
      itemsCount: cart.length,
    };
  };
const handleProceed = async () => {
  const { name, phone, location } = userInfo;

  if (!name || !phone || !location) {
    toast.error("Please Fill all of your information");
    return;
  }

  const summary = calculateSummary();
  const minOrder = settings.minOrderPrice || 0;
  if (summary.grandTotal < minOrder) {
      toast.error(`Minimum order is Rs ${minOrder}`);
      return;
    }
 const formattedItems = cart.map((item) => ({
  productId: item.id || item._id,
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
      `${process.env.React_App_API}/api/v1/orders/create-order`,
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
   ...summary,
  }),
      }
    );

    const data = await res.json();

    if (!data.success) {
      toast.error("Order failed");
      return;
    }
    const orderToken = data.token; 
    const orderId = data.order._id;

    // 🔥 2. OPTIONAL: WhatsApp message
  const message = `
🛒 *New Order Received*

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
http://localhost:3000/dashboard/moderator/claim/${orderId}
`;

    const whatsappURL = `https://wa.me/923437648604?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappURL, "_blank");

    // 🔥 3. CLEAR CART
    setCart([]);
    localStorage.removeItem("cart");

    setShowModal(false);

    toast.success("Order placed successfully!");

  } catch (error) {
    console.log(error);
    toast.error("Something went wrong");
  }
};
useEffect(() => {
  const { finalTotal } = calculateSummary();
  setOrderPrice(finalTotal);
}, [cart]);
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
          <div className="cart-items" key={p.id || p._id}>
            <div>
              <h6 className="fw-bold">{p.name}</h6>
              <p className="fw-light fs-6">
                Rs. {p.price} x {p.quantity}
              </p>
            </div>

            <div className="qty-container">
              <button
                className="qty-btn"
                onClick={() => decreaseQty(p.id || p._id)}
              >
                −
              </button>

              <span className="qty-number">{p.quantity}</span>

              <button
                className="qty-btn"
                onClick={() => increaseQty(p.id || p._id)}
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
  placeholder="Phone (03XXXXXXXXX) *"
  className="form-control mb-2"
  value={userInfo.phone}
  maxLength={11}
  onChange={(e) => {
    let value = e.target.value;

    // ✅ allow only digits
    if (!/^\d*$/.test(value)) return;

    // ✅ must start with 0
    if (value.length === 1 && value !== "0") return;

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
              <p>Delivery <span>Rs {s.deliveryCharge}</span></p>
              <p>Packaging <span>Rs {s.packagingCharge}</span></p>

              <h5>Total <span>Rs {s.grandTotal}</span></h5>
            </div>

            <Button
              variant="danger"
              className="w-100 checkout-btn"
              onClick={() => {
                if (s.grandTotal < 300) {
                  toast.error("Minimum order Rs 300");
                  return;
                }
                if (!userInfo.name || !userInfo.phone || !userInfo.location) {
      toast.error("Please fill all fields");
      return;
    }
                setShowModal(true);
                setCartOpen(false)
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
            This may take a few minutes. You will receive a WhatsApp message once it's picked.
          </p>

          <p className="text-danger small">
            If not picked within 10 minutes, you can place your order again.
          </p>

        </div>

        {/* FOOTER */}
        <div className="modal-footer border-0 d-flex flex-column gap-2">

          <button
            className="btn btn-success w-100 d-flex align-items-center justify-content-center gap-2"
            onClick={handleProceed}
          >
            <FaWhatsapp size={20} />
             Confirm Order via WhatsApp
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
