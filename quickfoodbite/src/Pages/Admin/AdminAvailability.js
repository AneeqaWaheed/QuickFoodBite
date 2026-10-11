
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/auth";
import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";

const AdminAvailability = () => {
  const [auth, setAuth] = useAuth();
  const [date, setDate] = useState("");
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  const fetchAvailabilities = async (selectedDate = "") => {
    try {
      setLoading(true);
      setError("");

      const url = `${process.env.REACT_APP_API}/api/v1/availability/admin/all`;

      const { data } = await axios.get(url, {
        params: selectedDate ? { date: selectedDate } : {},
        headers: {
          Authorization: auth?.token,
        },
      });

      setAvailabilities(data.availabilities || []);
    } catch (err) {
      console.error("ADMIN AVAILABILITY ERROR:", err);

      setError(
        err.response?.data?.message ||
          "Unable to load moderator availability."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) {
      fetchAvailabilities(date);
    }
  }, [auth?.token, date]);

  return (
    <>
      {/* Navbar */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#000",
          padding: "10px 20px",
        }}
      >
        <div className="container-fluid justify-content-end">
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

      {/* Background and page content */}
      <div
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "calc(100vh - 56px)",
          width: "100%",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            minHeight: "calc(100vh - 56px)",
            width: "100%",
            padding: "30px 15px",
            boxSizing: "border-box",
          }}
        >
          <div className="container-fluid">
            <div className="row g-4">
              {/* Sidebar */}
              <div className="col-12 col-md-3">
                <AdminMenu />
              </div>

              {/* Main content */}
              <div className="col-12 col-md-9">
                <div
                  style={{
                    color: "#fff",
                    width: "100%",
                    minWidth: 0,
                  }}
                >
                  <h3 className="mb-4">
                    Moderator Availability
                  </h3>

                  {/* Date filter */}
                  <div
                    className="mb-4"
                    style={{ maxWidth: "320px" }}
                  >
                    <label className="form-label">
                      Filter by date
                    </label>

                    <input
                      type="date"
                      className="form-control"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-light mt-2"
                      onClick={() => setDate("")}
                    >
                      Show All Dates
                    </button>
                  </div>

                  {loading && <p>Loading availability...</p>}

                  {error && (
                    <p className="text-danger">{error}</p>
                  )}

                  {!loading &&
                    !error &&
                    availabilities.length === 0 && (
                      <p>No saved availability schedules found.</p>
                    )}

                  {!loading &&
                    availabilities.map((item) => {
                      const moderator = item.moderatorId;

                      return (
                        <div
                          className="card mb-3"
                          key={item._id}
                          style={{
                            width: "100%",
                            maxWidth: "100%",
                            color: "#212529",
                            overflow: "hidden",
                          }}
                        >
                          <div className="card-body">
                            <h5>
                              {moderator?.firstName ||
                                moderator?.username ||
                                "Moderator"}
                            </h5>

                            {moderator?.email && (
                              <p className="mb-1">
                                {moderator.email}
                              </p>
                            )}

                            <p className="text-muted mb-3">
                              Date: {item.date}
                            </p>

                            {item.slots?.length > 0 ? (
                              <div className="table-responsive">
                                <table className="table table-bordered table-hover mb-0">
                                  <thead>
                                    <tr>
                                      <th>Start Time</th>
                                      <th>End Time</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {item.slots.map(
                                      (slot, index) => (
                                        <tr key={index}>
                                          <td>
                                            {slot.startTime}
                                          </td>
                                          <td>
                                            {slot.endTime}
                                          </td>
                                          <td>
                                            <span
                                              className={`badge ${
                                                slot.isAvailable
                                                  ? "bg-success"
                                                  : "bg-secondary"
                                              }`}
                                            >
                                              {slot.isAvailable
                                                ? "Available"
                                                : "Unavailable"}
                                            </span>
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="mb-0">
                                No time slots added.
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAvailability;
