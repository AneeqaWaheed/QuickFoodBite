import React, { useEffect, useState }  from "react";
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";

const ModeratorOrders = () => {
    const [orders, setOrders] = useState([]);
      const [currentPage, setCurrentPage] = useState(1);
      const [productsPerPage] = useState(5); 
    const [auth, setAuth] = useAuth();
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
        const response = await axios.get(
          `${process.env.React_App_API}/api/v1/orders/all-orders`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Calculate the index of the last product on the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  // Calculate the index of the first product on the current page
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  // Get the current products
  const currentProducts = orders.slice(indexOfFirstProduct, indexOfLastProduct);

  // Handle pagination
  const totalPages = Math.ceil(orders.length / productsPerPage);

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

            {/* Responsive Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">User Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Product Name</th>
                    <th scope="col">Product Price</th>
                    <th scope="col">Quantity</th>
                    <th scope="col">Total Amount</th>
                    <th scope="col">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {currentProducts.map((order) => (
                    <tr key={order?._id}>
                      <td>{order?.userId?.firstName}</td>
                      <td>{order?.userId?.email}</td>
                      <td>{order?.items?.[0]?.productId?.name}</td>
                      <td>${order?.items?.[0]?.productId?.price}</td>
                      <td>{order?.items?.[0]?.quantity}</td>
                      <td>${order?.totalAmount}</td>
                      <td>{order?.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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

</SimpleLayout>
   </>
  );
};

export default ModeratorOrders;
