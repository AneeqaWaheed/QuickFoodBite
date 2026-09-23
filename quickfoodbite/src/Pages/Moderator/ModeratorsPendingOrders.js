
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
import ModeratorNavbar from "../../Components/Layout/ModeratorNavbar";
import { useEffect, useState } from "react";
import axios from "axios";
const ModeratorPendingOrders = () => {
    const [auth, setAuth] = useAuth();
    const [orders, setOrders] = useState([]);
const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();
   const handleLogout = () => {
      toast.success("Logout Successfully");
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
  
      localStorage.removeItem("auth");
  
      navigate("/login");
    };
    const getPendingOrders = async () => {
  try {
    const { data } = await axios.get(
      `${process.env.REACT_APP_API}/api/v1/orders/pending-moderator-orders`,
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    if (data.success) {
      setOrders(data.orders);
    }
  } catch (error) {
   
    toast.error("Failed to load pending orders");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  if (!auth?.token) return;

  getPendingOrders();

  const interval = setInterval(() => {
    getPendingOrders();
  }, 5000);

  return () => clearInterval(interval);
}, [auth?.token]);
  return (
   <>
 <SimpleLayout title="Moderator - Profile">
<ModeratorNavbar  handleLogout={handleLogout} />
  {/* MAIN SECTION */}
 <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${pickUp})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          height: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            height: "100vh",
            width: "100%",
            margin: "0px",
            padding: "20px",
            overflowY: "auto",
          }}
        >
      {/* SIDEBAR */}
      <div className="col-md-3 mb-4 mb-md-0">
        <div className="bg-black p-3 rounded shadow">
          <ModeratorMenu />
        </div>
      </div>

      {/* PROFILE CONTENT */}
      {/* PROFILE CONTENT */}
<div className="col-md-9 text-white">
  <h2 className="mb-4">Pending Orders</h2>

  {loading ? (
    <h5>Loading orders...</h5>
  ) : orders.length === 0 ? (
    <div className="alert alert-info">
      No pending orders available.
    </div>
  ) : (
    orders.map((order) => (
      <div
        key={order._id}
        className="bg-dark p-4 mb-3 rounded shadow w-100"
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            New Order {order.userName}
          </h5>

          <span className="badge bg-warning text-dark">
            Pending
          </span>
        </div>

        <hr />

        <p>
          <strong>Created:</strong>{" "}
          {new Date(order.createdAt).toLocaleString()}
        </p>

        <p>
          <strong>Total:</strong> Rs. {order.total}
        </p>

        <div className="mb-3">
          <strong>Items:</strong>

          <ul className="mt-2 mb-0">
            {order.items?.map((item, index) => (
              <li key={index}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>

        <p>
          <strong>Location:</strong> {order.location}
        </p>

        <button
          className="btn btn-primary"
          onClick={() =>
            navigate(`/dashboard/moderator/claim/${order._id}`)
          }
        >
          View / Claim Order
        </button>
      </div>
    ))
  )}
</div>
    </div>
  </div>

</SimpleLayout>
   </>
  );
};

export default ModeratorPendingOrders;
