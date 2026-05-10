import { useEffect, useState }  from "react";
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import axios from "axios";
import { toast } from "react-toastify";
import {useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
import OrderStats from "../../utils/OrderStats";

const ModeratorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState("all");
      const [currentPage, setCurrentPage] = useState(1);
      const [productsPerPage] = useState(5); 
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);
    console.log("Auth user:", auth)
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
      setLoading(true);

      const { data } = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/orders/my-orders`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      setOrders(data.orders);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);
const filteredOrders = orders.filter((order) => {
  if (filter === "all") return true;

  const orderDate = new Date(order.createdAt);
  const today = new Date();

  // DAILY
  if (filter === "daily") {
    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  }

  // WEEKLY
  if (filter === "weekly") {
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);

    return orderDate >= weekAgo;
  }

  // MONTHLY
  if (filter === "monthly") {
    return (
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
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
 <SimpleLayout title="Moderator - Profile">

  {/* NAVBAR */}
  <nav className="navbar navbar-dark bg-dark px-3">
    <div className="container-fluid justify-content-end">
      <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
        Logout
      </button>
    </div>
  </nav>

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

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 rounded">
            <h1 className="text-center text-white">Orders</h1>
{loading ? (
  <h3 className="text-white text-center">Loading orders...</h3>
) : (
  <>
  <div className="mb-3 text-center">
  <button
    className={`btn btn-sm me-2 ${
      filter === "all" ? "btn-primary" : "btn-outline-primary"
    }`}
    onClick={() => {
      setFilter("all");
      setCurrentPage(1);
    }}
  >
    All
  </button>

  <button
    className={`btn btn-sm me-2 ${
      filter === "daily" ? "btn-primary" : "btn-outline-primary"
    }`}
    onClick={() => {
      setFilter("daily");
      setCurrentPage(1);
    }}
  >
    Daily
  </button>

  <button
    className={`btn btn-sm me-2 ${
      filter === "weekly" ? "btn-primary" : "btn-outline-primary"
    }`}
    onClick={() => {
      setFilter("weekly");
      setCurrentPage(1);
    }}
  >
    Weekly
  </button>

  <button
    className={`btn btn-sm ${
      filter === "monthly" ? "btn-primary" : "btn-outline-primary"
    }`}
    onClick={() => {
      setFilter("monthly");
      setCurrentPage(1);
    }}
  >
    Monthly
  </button>
</div>
            {/* Responsive Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">User Contact </th>
                    <th scope="col">User Location</th>
                    <th scope="col">Products</th>
                    <th scope="col">Product Amount</th>
                    <th scope="col">Delivery Charges</th>
                    <th scope="col">Packaging Fee</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Status</th>
                    <th scope="col">Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts.map((order) => (
                    <tr key={order?._id}>
                      <td>{order?.userName}</td>
                      <td>{order?.phone}</td>
                      <td>{order?.location}</td>
                     <td>
  {order?.items?.map((p) => (
    <p key={p._id}>
      {p.name} x {p.quantity}
    </p>
  ))}
</td>
                   
                      <td>Rs.{order?.subtotal}</td>
                      <td>Rs.{order?.deliveryCharges}</td>
                      <td>Rs.{order?.PackagingFee}</td>
                      <td>Rs.{order?.total}</td>
                      <td>{order?.status}</td>
                      <td>
  {new Date(order?.createdAt).toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })}
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <OrderStats orders={orders} filter={filter} />
            </div>
            </>
)}

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

</SimpleLayout>
   </>
  );
};

export default ModeratorOrders;
