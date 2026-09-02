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
import { Modal } from "react-bootstrap";
const AdminOrders = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);
const [selectedOrder, setSelectedOrder] = useState(null);
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
const handleDeleteOrder = async (orderId) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    const { data } = await axios.delete(
      `${process.env.REACT_APP_API}/api/v1/orders/delete/${orderId}`,
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    if (data.success) {
      toast.success("Order deleted successfully");

      // Remove it immediately from the table
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order._id !== orderId)
      );
    }
  } catch (error) {
    console.error("Delete order error:", error);

    toast.error(
      error.response?.data?.message ||
        "Failed to delete order"
    );
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
                    <th scope="col">Updates</th>
                    <th scope="col">Order Date</th>
                    <th scope="col">Actions</th>
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
  {order?.orderUpdates?.length > 0 ? (
    <Button
      variant="warning"
      size="sm"
      onClick={() => {
        setSelectedOrder(order);
        setShowUpdateModal(true);
      }}
    >
      Updated ({order.orderUpdates.length})
    </Button>
  ) : (
    <span className="text-muted">No updates</span>
  )}
</td>
      <td>
  {new Date(order?.createdAt).toLocaleDateString()}{" "}
  {new Date(order?.createdAt).toLocaleTimeString()}
</td>
<td>
  <Button
    variant="danger"
    size="sm"
    onClick={() => handleDeleteOrder(order._id)}
  >
    Delete
  </Button>
</td>
    </tr>

  ))}
</tbody>
              </table>
              <AdminOrderStats
  orders={filteredOrders.filter(
    (order) => order.status?.toLowerCase() !== "cancelled"
  )}
/>
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
      <Modal
  show={showUpdateModal}
  onHide={() => {
    setShowUpdateModal(false);
    setSelectedOrder(null);
  }}
  centered
  size="lg"
>
  <Modal.Header closeButton>
    <Modal.Title>
      Order Update History
    </Modal.Title>
  </Modal.Header>

  <Modal.Body>
    {selectedOrder?.orderUpdates?.length > 0 ? (
      selectedOrder.orderUpdates
        .slice()
        .reverse()
        .map((update, index) => (
          <div
            key={index}
            className="border rounded p-3 mb-3"
          >
            <div className="d-flex justify-content-between mb-2">
              <strong>
                Update #{selectedOrder.orderUpdates.length - index}
              </strong>

              <small className="text-muted">
                {new Date(update.createdAt).toLocaleString()}
              </small>
            </div>

            <div className="mb-2">
              <strong>Changes:</strong>
            </div>

            {update.changes?.map((change, changeIndex) => (
              <div
                key={changeIndex}
                className="mb-1"
              >
                {change.type === "added" && (
                  <span className="text-success">
                    ➕ {change.productName} ×{" "}
                    {change.newQuantity} added
                  </span>
                )}

                {change.type === "removed" && (
                  <span className="text-danger">
                    ➖ {change.productName} removed
                  </span>
                )}

                {change.type === "quantity_changed" && (
                  <span className="text-primary">
                    🔄 {change.productName}:{" "}
                    {change.oldQuantity} →{" "}
                    {change.newQuantity}
                  </span>
                )}
              </div>
            ))}

            <hr />

            <div>
              <strong>Subtotal:</strong>{" "}
              Rs {update.oldSubtotal} → Rs{" "}
              {update.newSubtotal}
            </div>

            <div>
              <strong>Total:</strong>{" "}
              Rs {update.oldTotal} → Rs{" "}
              {update.newTotal}
            </div>
          </div>
        ))
    ) : (
      <p className="text-center mb-0">
        No updates found for this order.
      </p>
    )}
  </Modal.Body>

  <Modal.Footer>
    <Button
      variant="secondary"
      onClick={() => {
        setShowUpdateModal(false);
        setSelectedOrder(null);
      }}
    >
      Close
    </Button>
  </Modal.Footer>
</Modal>
    </>
  );
};

export default AdminOrders;
