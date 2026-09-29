import { useState, useEffect } from "react";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import AdminMenu from "../../Components/Layout/AdminMenu";
import bgImage from "../../assets/bg-boxed.jpg";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const AdminPromoAd = () => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [ads, setAds] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState("");
const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState({
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });

  const [image, setImage] = useState(null);

  // Logout
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

  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle active/inactive
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      isActive: e.target.value === "true",
    });
  };

  // Reset form
const resetForm = () => {
  setFormData({
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });

  setImage(null);
  setImageError("");
  setSubmitError("");

  const fileInput = document.getElementById("promoImage");

  if (fileInput) {
    fileInput.value = "";
  }
};

  // Close modal
  const handleCloseModal = () => {
    if (loading) return;

    resetForm();
    setShowModal(false);
  };
// Validate promotional image ratio
const handleImageChange = (e) => {
  const file = e.target.files[0];

  setImageError("");
  setImage(null);

  if (!file) return;

  const img = new Image();

  img.onload = () => {
    const width = img.width;
    const height = img.height;

    const expectedRatio = 32 / 9;
    const actualRatio = width / height;

    if (Math.abs(actualRatio - expectedRatio) > 0.01) {
      setImageError(
        `Invalid image ratio. Please upload a 32:9 image. Current size: ${width} × ${height}px`
      );

      e.target.value = "";
      return;
    }

    setImage(file);
  };

  img.onerror = () => {
    setImageError("Invalid image file.");
    e.target.value = "";
  };

  img.src = URL.createObjectURL(file);
};
  // Submit ad
  const handleSubmit = async (e) => {
  e.preventDefault();

  setSubmitError("");

  if (!image) {
    setImageError("Please select a valid 32:9 image.");
    return;
  }

  if (imageError) {
    return;
  }

  try {
    setLoading(true);

    const data = new FormData();

    data.append("buttonText", formData.buttonText);
    data.append("buttonLink", formData.buttonLink);
    data.append("isActive", formData.isActive);
    data.append("image", image);

    const response = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/ads/create`,
      data,
      {
        headers: {
          Authorization: auth?.token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.data.success) {
      toast.success("Promotional ad added successfully");

      resetForm();
      setShowModal(false);
      getAds();
    }
  
   } catch (error) {
 

  setSubmitError(
    error?.response?.data?.message ||
      "Something went wrong while adding the advertisement."
  );

  } finally {
    setLoading(false);
  }
};

  // Get all ads
  const getAds = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API}/api/v1/ads/all`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (response.data.success) {
        setAds(response.data.ads);
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to load advertisements"
      );
    }
  };

  // Delete ad
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this advertisement?"
    );

    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API}/api/v1/ads/delete/${id}`,
        {
          headers: {
            Authorization: auth?.token,
          },
        }
      );

      if (response.data.success) {
        toast.success("Advertisement deleted");

        getAds();
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Unable to delete advertisement"
      );
    }
  };
  // Toggle ad status
const handleToggleStatus = async (id) => {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API}/api/v1/ads/toggle/${id}`,
      {},
      {
        headers: {
          Authorization: auth?.token,
        },
      }
    );

    if (response.data.success) {
      toast.success(response.data.message);
      getAds();
    }
  } catch (error) {
    console.log(error);

    toast.error(
      error?.response?.data?.message ||
        "Unable to update advertisement status"
    );
  }
};

  useEffect(() => {
    if (auth?.token) {
      getAds();
    }
  }, [auth?.token]);

  // Only active ads
  const activeAds = ads.filter((ad) => ad.isActive);

  return (
    <>
      {/* Top Navbar */}
      <nav
        className="navbar navbar-expand-lg"
        style={{
          backgroundColor: "#000",
          padding: "10px 20px",
        }}
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

      {/* Background */}
      <div
        className="container-fluid"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed",
          minHeight: "100vh",
          width: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            minHeight: "100vh",
            width: "100%",
            padding: "50px",
            margin: "0px",
          }}
        >
          {/* Admin Menu */}
          <div className="col-lg-3 col-md-4 col-sm-12 mb-4">
            <AdminMenu />
          </div>

          {/* Main Content */}
          <div className="col-lg-9 col-md-8 col-sm-12">
            <div className="card shadow">

              {/* Header */}
              <div className="card-header bg-danger text-white d-flex justify-content-between align-items-center">
                <h4 className="mb-0">
                  Promotional Advertisements
                </h4>

                <button
                  className="btn btn-light"
                  onClick={() => setShowModal(true)}
                >
                  + Create Ad
                </button>
              </div>

              <div className="card-body">

                {/* Active Ads */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">
                    Promotional Ads
                  </h5>

                  <span className="badge bg-success">
                    {activeAds.length} Active
                  </span>
                </div>

                {ads.length === 0 ? (
                  <div className="text-center py-5">
                    <p className="text-muted mb-0">
                      No active promotional advertisements found.
                    </p>

                    <button
                      className="btn btn-danger mt-3"
                      onClick={() => setShowModal(true)}
                    >
                      Create Promotional Ad
                    </button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle">

                      <thead className="table-dark">
                        <tr>
                          <th>#</th>
                          <th>Image</th>
                          <th>Button Text</th>
                          <th>Button Link</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {ads.map((ad, index) => (
                          <tr key={ad._id}>

                            <td>
                              {index + 1}
                            </td>

                            <td>
                <img
  src={ad.image}
  alt="Promotional Ad"
  style={{
    width: "160px",
    aspectRatio: "32 / 9",
    objectFit: "cover",
    borderRadius: "5px",
  }}
/>
                            </td>

                            <td>
                              {ad.buttonText || "-"}
                            </td>

                            <td>
                              <span className="text-break">
                                {ad.buttonLink || "-"}
                              </span>
                            </td>

                           <td>
  <span
    className={`badge ${
      ad.isActive ? "bg-success" : "bg-secondary"
    }`}
  >
    {ad.isActive ? "Active" : "Inactive"}
  </span>
</td>

                            <td>
  <div className="d-flex gap-2">
    <button
      className={`btn btn-sm ${
        ad.isActive ? "btn-warning" : "btn-success"
      }`}
      onClick={() => handleToggleStatus(ad._id)}
    >
      {ad.isActive ? "Deactivate" : "Activate"}
    </button>

    <button
      className="btn btn-danger btn-sm"
      onClick={() => handleDelete(ad._id)}
    >
      Delete
    </button>
  </div>
</td>

                          </tr>
                        ))}
                      </tbody>

                    </table>
                  </div>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CREATE AD MODAL */}
      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">

            <div className="modal-content">

              {/* Modal Header */}
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  Create Promotional Advertisement
                </h5>

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleCloseModal}
                  disabled={loading}
                ></button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit}>

                <div className="modal-body">

                  <div className="row">

                    {/* Button Text */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Button Text
                      </label>

                      <input
                        type="text"
                        name="buttonText"
                        className="form-control"
                        placeholder="Order Now"
                        value={formData.buttonText}
                        onChange={handleChange}
                      />
                    </div>

                    {/* Button Link */}
                    <div className="col-md-6 mb-3">
                      <label className="form-label">
                        Button Link
                      </label>

                      <input
                        type="text"
                        name="buttonLink"
                        className="form-control"
                        placeholder="/products"
                        value={formData.buttonLink}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  {/* Image */}
                 <div className="mb-3">
  <label className="form-label">
    Promotional Image
  </label>

 <input
  id="promoImage"
  type="file"
  className="form-control"
  accept="image/*"
  onChange={handleImageChange}
/>
{imageError && (
  <div className="text-danger mt-2">
    {imageError}
  </div>
)}
  <small className="text-muted">
    Recommended image ratio: <strong>32:9</strong>
    <br />
    Example size: <strong>1920 × 540 px</strong>
  </small>

  {image && (
    <div className="mt-3">
      <img
        src={URL.createObjectURL(image)}
        alt="Preview"
        style={{
          width: "100%",
          aspectRatio: "32 / 9",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    </div>
  )}
</div>

                  {/* Status */}
                  <div className="mb-3">
                    <label className="form-label">
                      Status
                    </label>

                    <select
                      className="form-select"
                      value={formData.isActive}
                      onChange={handleStatusChange}
                    >
                      <option value="true">
                        Active
                      </option>

                      <option value="false">
                        Inactive
                      </option>
                    </select>
                  </div>

                </div>
{submitError && (
  <div className="alert alert-danger mx-3">
    {submitError}
  </div>
)}
                {/* Modal Footer */}
                <div className="modal-footer">

                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-danger"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating..."
                      : "Create Advertisement"}
                  </button>

                </div>

              </form>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminPromoAd;
