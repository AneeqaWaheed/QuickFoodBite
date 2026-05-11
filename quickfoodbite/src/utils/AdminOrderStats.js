import React from "react";

const AdminOrderStats = ({ orders }) => {
  const deliveryTotal = orders.reduce(
    (acc, item) => acc + (Number(item.deliveryCharges) || 0),
    0
  );

  const packagingTotal = orders.reduce(
    (acc, item) => acc + (Number(item.PackagingFee) || 0),
    0
  );

  const moderatorEarnings = Math.round(deliveryTotal * 0.85);

  const adminEarnings = Math.round(deliveryTotal * 0.15 + packagingTotal);

  return (
    <div className="row text-white mb-3">

      <div className="col-md-3 col-6 mb-2">
        <div className="p-3 bg-dark rounded text-center">
          <h6>Total Delivery</h6>
          <h5>Rs {Math.round(deliveryTotal)}</h5>
        </div>
      </div>

      <div className="col-md-3 col-6 mb-2">
        <div className="p-3 bg-dark rounded text-center">
          <h6>Packaging Fee</h6>
          <h5>Rs {Math.round(packagingTotal)}</h5>
        </div>
      </div>

      <div className="col-md-3 col-6 mb-2">
        <div className="p-3 bg-success rounded text-center">
          <h6>Moderator Earnings</h6>
          <h5>Rs {moderatorEarnings}</h5>
        </div>
      </div>

      <div className="col-md-3 col-6 mb-2">
        <div className="p-3 bg-primary rounded text-center">
          <h6>Admin Earnings</h6>
          <h5>Rs {adminEarnings}</h5>
        </div>
      </div>

    </div>
  );
};

export default AdminOrderStats;