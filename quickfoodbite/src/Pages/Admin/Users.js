import  { useEffect, useState } from "react";
import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";

const Users = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Number of products per page
const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/all-users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
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

  // Calculate pagination indices

 const filteredUsers = users.filter((user) => {
  const fullName = `${user.firstName} ${user.lastName || ""}`.toLowerCase();
  return fullName.includes(searchTerm.toLowerCase());
});

const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

const currentProducts = filteredUsers.slice(
  indexOfFirstProduct,
  indexOfLastProduct
);

  // Handle pagination
  const totalPages = Math.ceil(filteredUsers.length / productsPerPage);

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
const handleToggleSuspension = async (userId) => {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to change this user's account status?"
    );

    if (!confirmed) return;

    const response = await axios.put(
      `${process.env.REACT_APP_API}/api/v1/admin/users/${userId}/toggle-suspension`
    );

    if (response.data.success) {
      toast.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId
            ? {
                ...user,
                isSuspended: !user.isSuspended,
              }
            : user
        )
      );
    }
  } catch (error) {
    console.error("Error changing user status:", error);

    toast.error(
      error.response?.data?.message || "Failed to update user status"
    );
  }
};
const handleDeleteUser = async (userId) => {
  try {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this user?"
    );

    if (!confirmed) return;

    const response = await axios.delete(
      `${process.env.REACT_APP_API}/api/v1/admin/users/${userId}`
    );

    if (response.data.success) {
      toast.success(response.data.message);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userId)
      );
    }
  } catch (error) {
    console.error("Error deleting user:", error);

    toast.error(
      error.response?.data?.message || "Failed to delete user"
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
            padding: "20px",
            margin: "0px",
            overflowY: "auto", // Enables scrolling if content overflows
          }}
        >
          {/* Sidebar for Admin Menu */}
          <div className="col-lg-3 col-md-4 mb-4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8">
            <h1 className="text-center text-white">USERS</h1>
<div className="mb-3 d-flex justify-content-end">
  <input
    type="text"
    className="form-control"
    style={{
      width: "40%",
      maxWidth: "400px",
    }}
    placeholder="Search user by name..."
    value={searchTerm}
    onChange={(e) => {
      setSearchTerm(e.target.value);
      setCurrentPage(1);
    }}
  />
</div>
            {/* Responsive Table */}
            <div className="table-responsive">
              <table className="table table-striped table-bordered text-center">
                <thead className="table-dark">
                  <tr>
                    <th scope="col">Sr No</th>
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Student Id</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Status</th>
<th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((user, index) => (
                    <tr key={user._id}>
                      <td>{indexOfFirstProduct + index + 1}</td>
                      <td>{user.firstName}</td>
                      <td>{user.lastName || "No Last Name"}</td>
                      <td>{user.phone}</td>
                      <td>{user.studentId}</td>
                      <td>{user.email}</td>
                      <td>{user.role === 1 ? "Admin" : "Moderator"}</td>
                      <td>
  {user.isSuspended ? (
    <span className="badge bg-danger">Suspended</span>
  ) : (
    <span className="badge bg-success">Active</span>
  )}
</td>

<td>
  {user.role === 1 ? (
    <span className="text-muted">Admin</span>
  ) : (
    <div className="d-flex justify-content-center gap-2">
      <button
        className={`btn btn-sm ${
          user.isSuspended ? "btn-success" : "btn-warning"
        }`}
        onClick={() => handleToggleSuspension(user._id)}
      >
        {user.isSuspended ? "Unsuspend" : "Suspend"}
      </button>

      <button
        className="btn btn-sm btn-danger"
        onClick={() => handleDeleteUser(user._id)}
      >
        Delete
      </button>
    </div>
  )}
</td>
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
      </>
    
  );
};

export default Users;
