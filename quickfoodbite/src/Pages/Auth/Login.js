import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link, useLocation } from "react-router-dom";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import "../../styles/register.css";
import { useAuth } from "../../context/auth";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();

  const location = useLocation();

  //form submission
 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      `${process.env.React_App_API}/api/v1/auth/login`,
      { email, password }
    );

    if (res.data.success) {
      toast.success(res.data.message);

      const user = res.data.user;
      const token = res.data.token;

      setAuth({
        ...auth,
        user,
        token,
      });

      localStorage.setItem("auth", JSON.stringify(res.data));

      // 🔥 Role-based navigation
      if (user.role === 1) {
        navigate("/dashboard/admin");
      } else {
        navigate("/dashboard/moderator");
      }

    } else {
      toast.error(res.data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Something went Wrong");
  }
};
  return (
    <GeneralLayout title={"Login - BurgerShop"}>
      <div className="register-container">
        <div className="register-form">
          <h1 className="text-center my-4 text-danger">Login Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="email"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-control"
                id="email"
                placeholder="Enter Your Email"
                required
              />
              <div id="emailHelp" class="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label
                htmlFor="password"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                id="password"
                placeholder="Enter Your Password"
                required
              />
            </div>

            <button type="submit" className="btn btn-danger">
              Submit
            </button>

            <div className="container mt-3">
              <p>
                Don't have an account?{" "}
                <Link to="/register" className="text-danger fw-semibold">
                  Sign Up
                </Link>
                <br />
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
    </GeneralLayout>
  );
};

export default Login;
