import React from "react";
import { toast } from "react-toastify";
import { useCart } from "../../context/cart";
import "./orderStyle.css";
import { Button } from "react-bootstrap";
import { useState,useEffect } from "react";
import axios from "axios";
import { FaWhatsapp } from "react-icons/fa6";
import OrderModal from "../../Components/Modal/OrderModal";
import calculateSummary from "../../utils/calculateSummary";
import proceedOrder from "../../services/orderService";
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
const summary = calculateSummary(
  cart,
  charges,
  settings
);
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
    <h5>Your Order Testinggggggggggg({cart.length})</h5>
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
        const s = calculateSummary(
  cart,
  charges,
  settings
);
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
<OrderModal
  showModal={showModal}
  setShowModal={setShowModal}
  handleProceed={() =>
    proceedOrder({
      loading,
      setLoading,
      userInfo,
      settings,
      cart,
      summary,
      clearCart,
      setShowModal,
      getId,
    })
  }
  loading={loading}
/>
  </>
);
};


export default CartPage;
