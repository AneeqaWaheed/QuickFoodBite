import React from "react";
import { FaCoffee, FaShoppingBag, FaArrowRight } from "react-icons/fa";
import "../styles/FleentMain.css";
import { Link } from "react-router-dom";

const FleentMain = () => {
  const handleServiceClick = (service) => {
    console.log(`${service} selected`);
  };

  return (
    <main className="service-main">
      <div className="service-container">

        <div className="service-heading">
         

          <h4>
            What do you need <span>today?</span>
          </h4>

          <p>
            Get food, essentials, and convenient services delivered
            right where you need them.
          </p>
        </div>

        <div className="service-options">

          {/* Cafe */}
          <Link to="/menu" className="text-decoration-none" >
          <div
            className="service-card cafe-card"
            onClick={() => handleServiceClick("Cafe")}
          >
            <div className="service-icon">
              <FaCoffee />
            </div>

            <div className="service-content">
              <h2>Cafe</h2>

              <p>
                Order food, drinks and other items from
                university cafes and canteens.
              </p>

              <button type="button">
                Order
                <FaArrowRight />
              </button>
            </div>
          </div>
</Link>

          {/* Other Services */}
          <Link to="/otherServices" className="text-decoration-none">
          <div
            className="service-card other-card"
            onClick={() => handleServiceClick("Other Services")}
          >
            <div className="service-icon">
              <FaShoppingBag color="#607427" />
            </div>

            <div className="service-content">
              <h2 className="">Other Services</h2>

              <p >
                Gate pickups, parcel collection,
                outside purchases and more.
              </p>

              <button type="button" >
                Order
                <FaArrowRight />
              </button>
            </div>
          </div>
</Link>
        </div>

        <div className="service-features">
          <span>⚡ Fast Delivery</span>
          <span>📍 Campus Wide</span>
          <span>🛵 Reliable Moderators</span>
        </div>

      </div>
    </main>
  );
};

export default FleentMain;