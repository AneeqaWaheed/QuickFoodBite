import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

const ClaimRedirectPage = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("token"); // (optional if you use later)
  const { orderId } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Claim Order Function
  const claimOrder = async () => {
    try {
      const { data } = await axios.put(
        `${process.env.REACT_APP_API}/api/v1/orders/claim/${orderId}`,
        {},
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );
      const itemsText = data?.order?.items
  ?.map((i) => `${i.name} x ${i.quantity}`)
  .join("\n");

const message = `${itemsText}\nPicked by ${auth?.user?.firstName}. It will be delivered soon.`;

     if (data?.success) {
  const itemsText = data?.order?.items
    ?.map((i) => `${i.name} x ${i.quantity}`)
    .join("\n");

  const message = `${itemsText}\nPicked by me ${auth?.user?.firstName}. It will be delivered soon.`;

  const whatsappURL = `https://wa.me/${data?.order?.phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");

  navigate("/dashboard/moderator/orders", { replace: true });
}
    } catch (err) {
  console.log("ERROR:", err.response?.data);

if (err.response?.status === 400) {
  setErrorMsg("⚠️ This order is already picked by another moderator");
} 
else if (err.response?.data?.status === "cancelled") {
  setErrorMsg("⚠️ Order is cancelled");
} 
else {
  setErrorMsg("Something went wrong. Please try again.");
}
}
  };

  // ✅ Check Auth Only (NO auto claim)
  useEffect(() => {
    if (!orderId) return;

    if (!auth?.user) {
      navigate("/login", {
        state: {
          redirect: `/dashboard/moderator/claim/${orderId}`,
        },
      });
    }
  }, [orderId, auth?.user, navigate]);

  // ✅ UI
  return (
  <div
  className="d-flex justify-content-center align-items-center position-fixed top-0 start-0 w-100 vh-100"
  style={{
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(10px)",
    zIndex: 1050,
  }}
>
  <div className="card shadow p-4 text-center" style={{ minWidth: "300px" }}>
    
    {/* ✅ Show error if exists */}
    {errorMsg ? (
      <>
        <h5 className="text-danger mb-3">{errorMsg}</h5>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/dashboard/moderator/orders")}
        >
          Go Back
        </button>
      </>
    ) : (
      <>
        <h4 className="mb-3">Do you want to pick this order?</h4>

        <div className="d-flex justify-content-center">
          <button
            className="btn btn-success me-2"
            onClick={claimOrder}
          >
            Yes, Pick Order
          </button>

          <button
            className="btn btn-danger"
            onClick={() => navigate("/dashboard/moderator/orders")}
          >
            Cancel
          </button>
        </div>
      </>
    )}
  </div>
</div>
  );
};

export default ClaimRedirectPage;