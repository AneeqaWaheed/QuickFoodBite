import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import "../../styles/register.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.React_App_API}/api/v1/auth/forgot-password`,
        { email }
      );
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      if (error.response) {
        // If error.response exists, it means the server responded with an error
        if (error.response.status === 404) {
          toast.error("User not found");
        } else {
          toast.error(
            error.response.data.message || "An unexpected error occurred"
          );
        }
      } else {
        // If error.response does not exist, it could be a network error or something else
        console.error("Error:", error.message);
        toast.error("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <GeneralLayout title={"ForgotPassword - BurgerShop"}>
      <div className="register-container">
        <div className="register-form">
          <h1 className="text-center my-4 text-danger">Forgot Password</h1>
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
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <button type="submit" className="btn btn-danger">
              Send Email
            </button>
          </form>
        </div>
        {/* <div className="register-image">
          <img src="/Images/login.jpg" alt="Registration Illustration" />
        </div> */}
      </div>
    </GeneralLayout>
  );
};

export default ForgotPassword;
