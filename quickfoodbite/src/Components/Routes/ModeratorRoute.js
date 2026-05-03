import { useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import axios from "axios";


export default function ModeratorRoute() {
  
  const [auth, setAuth] = useAuth();
 const location = useLocation();
  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API}/api/v1/auth/user-auth`
        );
        if (res.data.ok) {
       
        } else {
        
        }
      } catch (error) {
        console.error("Error during admin authentication check:", error);
       
      }
    };

    if (auth?.token) authCheck();
  }, [auth?.token]);

  // Inside your PrivateRoute component
return auth?.token ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;

}
