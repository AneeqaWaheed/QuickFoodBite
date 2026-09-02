import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaUser,
  FaClipboardList,
  FaArrowRight,
  FaCheckCircle,
  FaShoppingBag,
  FaBox,
  FaPen,
  FaDoorOpen,
} from "react-icons/fa";
import "../styles/OtherServices.css";
import { toast } from "react-toastify";
import { generateOrderNumber } from "../services/orderService.js";
const OtherServices = () => {
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    pickupPoint: "",
    deliveryPoint: "",
    category: "",
    wish: "",
    specialNotes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (loading) return;

  setLoading(true);

  const orderNumber = generateOrderNumber();

  try {
    const {
      name,
      phone,
      pickupPoint,
      deliveryPoint,
      category,
      wish,
      specialNotes,
    } = formData;

    if (!name.trim()) {
      setFormError("Name is required");
      return;
    }

    if (!phone.trim()) {
      setFormError("Phone number is required");
      return;
    }

    if (!pickupPoint.trim()) {
      setFormError("Pickup point is required");
      return;
    }

    if (!deliveryPoint.trim()) {
      setFormError("Delivery point is required");
      return;
    }

    if (!category.trim()) {
      setFormError("Please select a category");
      return;
    }

    if (!wish.trim()) {
      setFormError("Please describe what you need");
      return;
    }

    const orderData = {
      orderType: "service",

      userName: name,
      phone,

      pickupPoint,
      deliveryPoint,

      category,
      description: wish,
      specialNotes,

      items: [],

      subtotal: 0,
      discountTotal: 0,
      deliveryCharges: 0,
      PackagingFee: 0,
      total: 0,
    };

    console.log("SERVICE ORDER:", orderData);

    const res = await fetch(
      `${process.env.REACT_APP_API}/api/v1/orders/create-order`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      }
    );

    if (!res.ok) {
      const text = await res.text();

      console.log("Server Error:", text);

      setFormError("Server Error. Please try again later");
      return;
    }

    const data = await res.json();

    console.log("SERVICE ORDER RESPONSE:", data);

    if (!data?.success) {
      setFormError(
        data?.message || "Order failed. Please try again later"
      );
      return;
    }

    const orderId = data?.order?._id;

    console.log("Service order created:", orderId);

    const message = `
🧾 *ORDER #: ${orderNumber}*
🧾 *NEW SERVICE REQUEST*

👤 *Customer:* ${name}
📞 *Phone:* ${phone}

📍 *Pickup Point:*
${pickupPoint}

🏠 *Delivery Point:*
${deliveryPoint}

📦 *Category:* ${category}

📝 *What they need:*
${wish}

${
  specialNotes?.trim()
    ? `📌 *Special Notes:*\n${specialNotes}`
    : ""
}

🔗 *Track Order:*
${process.env.REACT_APP_CLIENT_URL}/orderTrack/${orderId}
`;

    const encodedMessage = encodeURIComponent(message);

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const whatsappURL = isMobile
      ? `whatsapp://send?phone=923265349097&text=${encodedMessage}`
      : `https://web.whatsapp.com/send?phone=923265349097&text=${encodedMessage}`;

    console.log("================================");
    console.log("✅ ORDER CREATED");
    console.log("Order ID:", orderId);
    console.log("WhatsApp URL:", whatsappURL);
    console.log("================================");

    setFormData({
      name: "",
      phone: "",
      pickupPoint: "",
      deliveryPoint: "",
      category: "",
      wish: "",
      specialNotes: "",
    });

    window.location.assign(whatsappURL);

  } catch (error) {
    console.log("SERVICE ORDER ERROR:", error);

    setFormError(
      "Something went wrong. Please try again later"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main className="other-service-page">

      <div className="other-service-layout">

        {/* =========================
            LEFT - FORM
        ========================== */}

        <div className="service-form-side">

          <div className="form-header">
            <span >OTHER SERVICES</span>

            <h1>
              Request a <strong>Service</strong>
            </h1>

            <p>
              Tell us what you need and we'll take care of the rest.
            </p>
          </div>

          <form
            className="service-request-form"
            onSubmit={handleSubmit}
          >

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                Your Name
              </label>

              <div className="input-wrapper">
                <FaUser className="fleent-input"/>

                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="fleent-input"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <div className="input-wrapper">
                <FaPhone />

                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  placeholder="03XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleChange}
                  maxLength="11"
                  required
                />
              </div>
            </div>

            {/* Pickup / Delivery */}
            <div className="location-grid">
<div className="form-group">
  <label htmlFor="pickupPoint">
    Pickup Point
  </label>

  <div className="dropdown">
    <div
      className="input-wrapper"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <FaMapMarkerAlt />

      <input
        id="pickupPoint"
        type="text"
        name="pickupPoint"
        placeholder="Where should we pick it up?"
        value={formData.pickupPoint}
        onChange={handleChange}
        required
        autoComplete="off"
      />
    </div>

    <ul className="dropdown-menu w-100">
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Abasi hotel ",
            }))
          }
        >
          Abasi hotel 
        </button>
      </li>
<li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "N Bus Stop",
            }))
          }
        >
          N Bus Stop

        </button>
      </li>
<li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Gate 2",
            }))
          }
        >
          Gate 2

        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Gate 3",
            }))
          }
        >
          Gate 3
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "N block",
            }))
          }
        >
          N block
        </button>
      </li>

      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "E block",
            }))
          }
        >
          E block
        </button>
      </li>

      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "A block",
            }))
          }
        >
          A block
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "C block",
            }))
          }
        >
          C block
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Architecture department",
            }))
          }
        >
          Architecture department
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "IRCBM",
            }))
          }
        >
          IRCBM
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Fatima Jinnah Hostel",
            }))
          }
        >
          Fatima Jinnah Hostel
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Faculty Block",
            }))
          }
        >
          Faculty Block
        </button>
      </li>
      <li>
        <button
          type="button"
          className="dropdown-item"
          onClick={() =>
            setFormData((prev) => ({
              ...prev,
              pickupPoint: "Library",
            }))
          }
        >
          Library
        </button>
      </li>
      
    </ul>
  </div>
</div>
              <div className="form-group">
                <label htmlFor="deliveryPoint">
                  Delivery Point
                </label>

                <div className="input-wrapper">
                  <FaMapMarkerAlt />

                  <input
                    id="deliveryPoint"
                    type="text"
                    name="deliveryPoint"
                    placeholder="Where should we deliver?"
                    value={formData.deliveryPoint}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">
                  Select a service category
                </option>

                

                <option value="parcel">
                  Parcel Pickup
                </option>

                <option value="gate-pickup">
                  Gate Pickup
                </option>

                

                <option value="food">
                  Food / Grocery
                </option>

                <option value="electronics">
                  Documents
                </option>

                <option value="other">
                  Other
                </option>
              </select>
            </div>

            {/* Wish */}
            <div className="form-group">
              <label htmlFor="wish">
                What do you need?
              </label>

              <textarea
                id="wish"
                name="wish"
                placeholder="Describe what you want us to pick up, purchase or deliver..."
                value={formData.wish}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            {/* Special Notes */}
            <div className="form-group">
              <label htmlFor="specialNotes">
                Special Notes
                <span>Optional</span>
              </label>

              <textarea
                id="specialNotes"
                name="specialNotes"
                placeholder="Any additional instructions?"
                value={formData.specialNotes}
                onChange={handleChange}
                rows="3"
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              className="place-service-btn"
            >
              Place Service Request
              <FaArrowRight />
            </button>

          </form>
        </div>


        {/* =========================
            RIGHT - INFORMATION
        ========================== */}

        <aside className="service-info-side">

          <div className="info-intro">

            <div className="info-icon">
              <FaShoppingBag />
            </div>

            <span>ON-DEMAND CAMPUS SERVICES</span>

            <h2>
              Need something?
              <br />
              <strong>We've got you.</strong>
            </h2>

            <p>
              Can't find what you're looking for on campus?
              Just tell us what you need. Our moderators will
              pick it up and deliver it right to you.
            </p>

          </div>


          {/* How it works */}

          <div className="how-it-works">

            <h3>How it works</h3>

            <div className="work-step">

              <div className="step-number">01</div>

              <div>
                <h4>Tell us what you need</h4>
                <p>
                  Submit a simple service request with
                  your pickup and delivery details.
                </p>
              </div>

            </div>

            <div className="work-step">

              <div className="step-number">02</div>

              <div>
                <h4>We find a moderator</h4>
                <p>
                  An available moderator receives your
                  request and accepts the job.
                </p>
              </div>

            </div>

            <div className="work-step">

              <div className="step-number">03</div>

              <div>
                <h4>We get it for you</h4>
                <p>
                  The moderator picks up or purchases
                  your requested item.
                </p>
              </div>

            </div>

            <div className="work-step">

              <div className="step-number">04</div>

              <div>
                <h4>Delivered to you</h4>
                <p>
                  Sit back and receive your order at
                  your chosen delivery point.
                </p>
              </div>

            </div>

          </div>


          {/* Services */}

          <div className="service-types">

            <h3>What can we help with?</h3>

            <div className="service-type-list">

              <div>
                <FaPen />
                <span>Stationery</span>
              </div>

              <div>
                <FaBox />
                <span>Parcel Pickup</span>
              </div>

              <div>
                <FaDoorOpen />
                <span>Gate Pickup</span>
              </div>

              <div>
                <FaShoppingBag />
                <span>Outside Shopping</span>
              </div>

            </div>

          </div>


          {/* Bottom note */}

          <div className="service-note">
            <FaCheckCircle />

            <span>
              Your request will be handled by an
              available campus moderator.
            </span>
          </div>

        </aside>

      </div>

    </main>
  );
};

export default OtherServices;