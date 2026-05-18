import React from "react";

const OrderStats = ({ orders, filter }) => {
 const calculateStats = () => {
  let filteredOrders = orders;

  const today = new Date();

  // DAILY
  if (filter === "daily") {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      return (
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
  }

  // WEEKLY
  else if (filter === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    filteredOrders = orders.filter(
      (order) => new Date(order.createdAt) >= weekAgo
    );
  }

  // MONTHLY
  else if (filter === "monthly") {
    filteredOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt);

      return (
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear()
      );
    });
  }

  const deliveryTotal = filteredOrders.reduce(
    (acc, item) => acc + (Number(item.deliveryCharges) || 0),
    0
  );

  const packagingTotal = filteredOrders.reduce(
    (acc, item) => acc + (Number(item.PackagingFee) || 0),
    0
  );

  const adminDeliveryShare = Math.round(deliveryTotal * 0.17);
  const userEarnings = Math.round(deliveryTotal * 0.83);

  const adminReturn = Math.round(adminDeliveryShare + packagingTotal);

  return {
    deliveryTotal: Math.round(deliveryTotal),
    packagingTotal: Math.round(packagingTotal),
    adminReturn,
    userEarnings,
  };
};

  const stats = calculateStats();

  return (
<div className="d-flex justify-content-end mt-3">
  <div
    className="p-3 bg-dark text-white rounded"
    style={{ width: "50%" }}
  >
    <div className="row text-end">

      {/* Row 1 */}
      <div className="col-6">
        <p className="mb-2">
          <strong>Delivery:</strong> Rs. {stats.deliveryTotal}
        </p>
      </div>

      <div className="col-6">
        <p className="mb-2">
          <strong>Packaging:</strong> Rs. {stats.packagingTotal}
        </p>
      </div>

      {/* Row 2 */}
      <div className="col-6">
        <p className="mb-0">
          <strong>Earnings:</strong> Rs. {stats.userEarnings}
        </p>
      </div>

      <div className="col-6">
        <p className="mb-0">
          <strong>Admin (17%):</strong> Rs.{" "}
          {stats.adminReturn.toFixed(0)}
        </p>
      </div>

    </div>
  </div>
</div>
  );
};

export default OrderStats;