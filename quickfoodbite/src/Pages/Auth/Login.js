import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";

import "../../styles/register.css";
import { useAuth } from "../../context/auth";

import SimpleLayout from "../../Components/Layout/SimpleLayout";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");


  const [finalRedirect, setFinalRedirect] = useState(null);
const redirectPath = location.state?.from?.pathname;


  //form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_API}/api/v1/auth/login`,
      { email, password }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      const user = res.data.user;
      const token = res.data.token;
      console.log("Login User:", user)

      setAuth({ user, token });

      localStorage.setItem("auth", JSON.stringify(res.data));

      // 🔥 Role-based navigation
    if (redirectPath) {

          setFinalRedirect(redirectPath);
        } else {
          setFinalRedirect(
            user.role === 1
              ? "/dashboard/admin"
              : "/dashboard/moderator"
          );
        }
      } else {
        toast.error(res.data.message);
      }
 } catch (error) {
  console.log(error);

  const status = error.response?.status;
  const message = error.response?.data?.message;

  if (!error.response) {
  
    setErrorMessage(error.message)
    return;
  }

  if (status === 404) {

    setErrorMessage(message || "User not found")
  } 
  else if (status === 401) {
  
    setErrorMessage(message || "Password Incorrect")
  } 
  else if (status === 400) {
 
    setErrorMessage(message || "Invalid Request")
  } 
  else {
  
    setErrorMessage(message || "Something went wrong")
  }
}
};
 useEffect(() => {
    if (finalRedirect) {
      navigate(finalRedirect, { replace: true });
    }
  }, [finalRedirect, navigate]);
  return (
    <SimpleLayout title={"Login - Fleent"}>
      <div className="register-container" title="Login-Fleent">
        <div className="register-form">
          <h1 className="text-center my-4 text-clr">Login Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-clr fw-semibold my-0 ms-1 fs-5"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
  setEmail(e.target.value);
  setErrorMessage(""); // clear error when user edits
}}
                className="form-control"
                id="email"
                placeholder="Enter Your Email"
                required
              />
              <div id="emailHelp" class="form-text text-clr">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label text-clr fw-semibold my-0 ms-1 fs-5"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
  setPassword(e.target.value);
  setErrorMessage(""); // clear error when user edits
}}
                className="form-control "
                id="password"
                placeholder="Enter Your Password"
                required
              />
            </div>
            {errorMessage && (
  <small className="text-danger d-block mt-1">
    {errorMessage}
  </small>
)}

            <button type="submit" className="btn btn-clr">
              Submit
            </button>

            <div className="container mt-3">
              <p>
                {/* Don't have an account?{" "}
                <Link to="/register" className="text-danger fw-semibold">
                  Sign Up
                </Link>
                <br /> */}
                <Link
                  to="/forgot-password"
                  className="text-danger fw-semibold "
                >
                  Forgot Password?
                </Link>
              </p>
            </div>
          </form>
        </div>
        {/* <div className="register-image">
          <img src="/Images/login.jpg" alt="Registration Illustration" />
        </div> */}
      </div>
     </SimpleLayout>
  );
};

export default Login;
