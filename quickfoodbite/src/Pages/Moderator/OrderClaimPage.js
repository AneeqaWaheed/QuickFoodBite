import { useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/auth";

const ClaimRedirectPage = () => {
    const location = useLocation();
const token = new URLSearchParams(location.search).get("token");
const { orderId } = useParams();
  const [auth] = useAuth();
  const navigate = useNavigate();
  const hasCalled = useRef(false);
   const claimOrder = async () => {
  console.log("STEP 1: inside claimOrder");

  try {
    console.log("STEP 2: before auth check");

    if (!auth?.user) {
      console.log("STEP 3: NOT LOGGED IN");
      navigate("/login", {
        state: {
          redirect: `/dashboard/moderator/claim/${orderId}`,
        },
      });
      return;
    }

    console.log("STEP 4: calling backend");

    const { data } = await axios.put(
      `${process.env.REACT_APP_API}/api/v1/orders/claim/${orderId}`,
      {},
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    console.log("STEP 5: response", auth);
     if (data?.success) {
  const message = `Your Order is Picked by ${auth?.user?.firstName}`;

  const whatsappURL = `https://wa.me/${data?.order?.phone}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank");

  navigate("/dashboard/moderator/orders", { replace: true });
}
  } catch (err) {
   console.log("ERROR:", err.response?.data);

  // 👉 If already claimed, still redirect
  setTimeout(() => {
        navigate("/dashboard/moderator/orders", { replace: true });
      }, 5000);
  if (err.response?.status === 400) {
    navigate("/dashboard/moderator/my-orders", { replace: true });
  }

  }
};

useEffect(() => {
  if (!orderId || !auth?.user) return;

  if (hasCalled.current) return;   // 🚫 block duplicate
  hasCalled.current = true;

  claimOrder();
}, [orderId, auth?.user]);
  return <h4>Assigning order...</h4>;
};

export default ClaimRedirectPage;