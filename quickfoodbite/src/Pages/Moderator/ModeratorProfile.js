import React from "react";
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink, useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
const ModeratorProfile = () => {
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

      {/* PROFILE CONTENT */}
      <div className="col-md-9 text-white">

        <div className="card bg-dark text-white shadow-lg border-0">
          <div className="card-body">

            <h3 className="card-title mb-3">
              Welcome{" "}
              <span className="text-danger">
                {auth?.user?.firstName} {auth?.user?.lastName}
              </span>
            </h3>

            <p className="text-White ">
              Complete your daily target to earn extra bonuses 💰
            </p>

            <hr className="border-light" />

            <div className="row">
              <div className="col-md-6 mb-2">
                <strong>Name:</strong>
                <p>{auth?.user?.firstName} {auth?.user?.lastName}</p>
              </div>

              <div className="col-md-6 mb-2">
                <strong>Email:</strong>
                <p>{auth?.user?.email}</p>
              </div>

              <div className="col-md-6 mb-2">
                <strong>Phone:</strong>
                <p>{auth?.user?.phone}</p>
              </div>

              <div className="col-md-6 mb-2">
                <strong>Gender:</strong>
                <p className="text-capitalize">{auth?.user?.gender}</p>
              </div>

              <div className="col-md-6 mb-2">
                <strong>Student ID:</strong>
                <p>{auth?.user?.studentId}</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>

</SimpleLayout>
   </>
  );
};

export default ModeratorProfile;
