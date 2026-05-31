import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../styles/trackOrder.css"

const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/orders/track/${orderId}`
        );
        setOrder(data.order);
      } catch (err) {
        console.log(err);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (!order) {
    return (
      <div className="track-container">
        <div className="loader">Loading order...</div>
      </div>
    );
  }

  return (
    <div className="track-container">
      <div className="track-card">

        <h2 className="title">Order Tracking</h2>

        <div className="order-id">
          Order ID: <span>{order._id}</span>
        </div>

        <div className={`status ${order.status}`}>
          {order.status.toUpperCase()}
        </div>

        <div className="info-box">
        <div className="info-box">
          <p><strong>Name:</strong> {order.userName}</p>
          <p><strong>Location:</strong> {order.location}</p>
          <p><strong>Total Charges:</strong> {order.total}</p>
          <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        </div>

        <div className="timeline">

  <div className={`step ${order.status ? "active" : ""}`}>
    Order Placed
  </div>

  <div className={`step ${
    ["picked", "delivered"].includes(order.status) ? "active" : ""
  }`}>
    Order Picked
  </div>

  <div className={`step ${
    order.status === "delivered" ? "active" : ""
  }`}>
    Delivered
  </div>

  {order.status === "cancelled" && (
    <div className="step cancelled active">
      Order Cancelled
    </div>
  )}

</div>

      </div>
    </div>
  );
};

export default TrackOrder;