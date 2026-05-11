import  {useEffect, useState } from "react";
import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Button } from "react-bootstrap";
import AdminOrderStats from "../../utils/AdminOrderStats.js";
const AdminOrders = () => {
  const [moderatorSearch, setModeratorSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(5); // Number of products per page
 const [auth, setAuth] = useAuth();
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
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/orders/all-orders`
        );
        setOrders(response.data.orders);
        console.log("Orders for Admin:", response)
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);
const now = new Date();

const filteredOrders = orders.filter((order) => {
  const orderDate = new Date(order.createdAt);

  // 🔎 moderator filter
  const moderatorName =
    order?.assignedModerator?.firstName?.toLowerCase() || "";

  const matchModerator = moderatorName.includes(
    moderatorSearch.toLowerCase()
  );

  if (!matchModerator) return false;

  if (filter === "daily") {
    return orderDate.toDateString() === now.toDateString();
  }

  if (filter === "weekly") {
    const diff = (now - orderDate) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }

  if (filter === "monthly") {
    return (
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear()
    );
  }

  return true;
});
  // Calculate the index of the last product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  // Calculate the index of the first product on the current page
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // Get the current products
  const currentProducts = filteredOrders.slice(
  indexOfFirstProduct,
  indexOfLastProduct
);

  // Handle pagination
  const totalPages = Math.ceil(filteredOrders.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };



  return (
      <>
      <nav
      className="navbar navbar-expand-lg"
      style={{ backgroundColor: "#000", padding: "10px 20px" }}
    >
      <div className="container-fluid d-flex justify-content-end">
    
        <NavLink
          onClick={handleLogout}
          to="/login"
          className="nav-link text-white"
          style={{ fontWeight: "500" }}
        >
          Logout
        </NavLink>
    
      </div>
    </nav>
    <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${bgImage})`,
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
          {/* Sidebar for Admin Menu */}
          <div className="col-lg-3 col-md-4 mb-4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 rounded">
            <h1 className="text-center text-white">Orders</h1>
<div className="mb-3 d-flex justify-content-between align-items-center flex-wrap gap-2">

  {/* LEFT SIDE: Filter Buttons */}
  <div className="d-flex flex-wrap gap-2">

    <button
      className={`btn btn-sm ${
        filter === "all" ? "btn-primary" : "btn-outline-primary"
      }`}
      onClick={() => setFilter("all")}
    >
      All
    </button>

    <button
      className={`btn btn-sm ${
        filter === "daily" ? "btn-primary" : "btn-outline-primary"
      }`}
      onClick={() => setFilter("daily")}
    >
      Daily
    </button>

    <button
      className={`btn btn-sm ${
        filter === "weekly" ? "btn-primary" : "btn-outline-primary"
      }`}
      onClick={() => setFilter("weekly")}
    >
      Weekly
    </button>

    <button
      className={`btn btn-sm ${
        filter === "monthly" ? "btn-primary" : "btn-outline-primary"
      }`}
      onClick={() => setFilter("monthly")}
    >
      Monthly
    </button>

  </div>

  {/* RIGHT SIDE: Search */}
  <div style={{ minWidth: "250px" }}>
    <input
      type="text"
      className="form-control"
      placeholder="Search moderator name..."
      value={moderatorSearch}
      onChange={(e) => setModeratorSearch(e.target.value)}
    />
  </div>

</div>
            {/* Responsive Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Sr. No</th>
                    <th scope="col">User Name</th>
                    <th scope="col">User Contact</th>
                    <th scope="col">Product Details</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Product Amount</th>
                    <th scope="col">Delivery Charges</th>
<th scope="col">Packaging Charges</th>
                    <th scope="col">Status</th>
                    <th scope="col">Assigned Mod</th>
                    <th scope="col">Order Date</th>
                  </tr>
                </thead>

            <tbody>
  {currentProducts.map((order, index) => (
    <tr key={order?._id}>
       <td>
        {indexOfFirstProduct + index + 1}
      </td>

      <td>{order?.userName}</td>
      <td>{order?.phone}</td>
      <td>
        {order?.items?.map((p) => (
          <p key={p._id}>
            {p?.name} x {p?.quantity} Rs{p?.price}
          </p>
        ))}
      </td>
      <td>Rs{order?.total}</td>
      <td>Rs{order?.subtotal}</td>
      <td>Rs {order?.deliveryCharges || 0}</td>
<td>Rs {order?.PackagingFee || 0}</td>
      <td>{order?.status}</td>
      <td>{order?.assignedModerator?.firstName}</td>
      <td>
  {new Date(order?.createdAt).toLocaleDateString()}{" "}
  {new Date(order?.createdAt).toLocaleTimeString()}
</td>
    </tr>
  ))}
</tbody>
              </table>
              <AdminOrderStats orders={filteredOrders} />
            </div>

            {/* Pagination Controls */}
            <div className="pagination-controls d-flex align-items-center justify-content-center mt-3">
              <button
                className="btn btn-danger me-2"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn btn-danger ms-2"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
