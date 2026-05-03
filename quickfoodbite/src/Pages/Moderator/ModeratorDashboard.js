import React from "react";
import { useAuth } from "../../context/auth";
import pickUp from "../../assets/pickUp.png";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import ModeratorMenu from "../../Components/Layout/ModeratorMenu";
import SimpleLayout from "../../Components/Layout/SimpleLayout";
const ModeratorDashboard = () => {
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
        const location = useLocation();
    
   const handleLogout = () => {
      toast.success("Logout Successfully");
      setAuth({
        ...auth,
        user: null,
        token: "",
      });
  
      localStorage.removeItem("auth");
  
      navigate("/login");
      console.log("LOCATION STATE:", location.state);
    };
  return (
   <>
   <SimpleLayout title={"Dashboard - Moderator"}>
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
        className="container-fluid "
        style={{
          backgroundImage: `url(${pickUp})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundAttachment: "fixed", // Keeps the background fixed during scrolling
          height: "100vh", // Sets the height to cover the full viewport height
          width: "100%", // Sets the width to cover the full viewport width
          margin: 0, // Removes default margins
          padding: 0,
        }}
      >
        <div
          className="row"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            height: "100vh",
            width: "100%",
            padding: "50px",
            margin: "0px",
          }}
        >
        
          <div className="col-md-3">
            <ModeratorMenu />
          </div>
          <div className="col-md-9">
            <h3 className="text-white m-3 mt-5">
              WELLCOME "{auth?.user?.firstName + " " + auth?.user?.lastName}" TO
              Moderator DASHBOARD
            </h3>
            <p className="text-white mx-4">
              We really appreciate your contribution to the Application{" "}
            </p>
          </div>
         
        </div>
      </div>
      </SimpleLayout>
   </>
  );
};

export default ModeratorDashboard;
