import React from "react";
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
const [errors, setErrors] = useState({
  name: "",
  phone: "",
  location: "",
  minOrder: "",
});
const [formError, setFormError] = useState("");
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
    <h5>Your Order({cart.length})</h5>
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
{errors.name && (
  <small style={{ color: "red" }}>{errors.name}</small>
)}
    <input
  type="text"
  placeholder="Phone (92XXXXXXXXXX) *"
  className="form-control mb-2"
  value={userInfo.phone}
  maxLength={12}
onChange={(e) => {
  let value = e.target.value;

  // allow only digits
  if (!/^\d*$/.test(value)) return;

  // if user starts with 0 → convert 0 to 92
  if (value.startsWith("0")) {
    value = "92" + value.slice(1);
  }

  // if user types without 92, auto add it
  if (value.length > 0 && !value.startsWith("92")) {
    value = "92" + value;
  }

  // prevent multiple 92 duplication
  if (value.startsWith("9292")) {
    value = "92" + value.slice(4);
  }

  setUserInfo({ ...userInfo, phone: value });
}}
/>
{errors.phone && (
  <small style={{ color: "red" }}>{errors.phone}</small>
)}

          <input
            type="text"
            placeholder="Location *"
            className="form-control"
            value={userInfo.location}
            onChange={(e) =>
              setUserInfo({ ...userInfo, location: e.target.value })
            }
          />
                {errors.location && (
  <small style={{ color: "red" }}>{errors.location}</small>
)}
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
            {errors.minOrder && (
  <div style={{ color: "red", marginBottom: "10px" }}>
    {errors.minOrder}
  </div>
)}
<Button
  
  className="w-100 checkout-btn"
  onClick={() => {
    const minOrder = settings?.minOrderPrice ?? 0;
const newErrors = {
  name: "",
  phone: "",
  location: "",
  minOrder: "",
};

let hasError = false;

if (!userInfo.name.trim()) {
  newErrors.name = "Name is required";
  hasError = true;
}

if (!userInfo.phone.trim()) {
  newErrors.phone = "Phone number is required";
  hasError = true;
}

if (!userInfo.location.trim()) {
  newErrors.location = "Location is required";
  hasError = true;
}

if (s.subtotal < minOrder) {
  newErrors.minOrder = `Minimum order is Rs ${minOrder}`;
  hasError = true;
}

setErrors(newErrors);

if (hasError) return;

setShowModal(true);
setCartOpen(false);

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
      setFormError,
    })
  }
  loading={loading}
    formError={formError}   // ✅ MUST be here

/>
  </>
);
};


export default CartPage;
