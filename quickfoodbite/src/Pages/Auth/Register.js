import  { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import SimpleLayout from "../../Components/Layout/SimpleLayout.js";
import "../../styles/register.css";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  const [studentId, setStudentId] = useState("");
  const [phone, setPhone] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API}/api/v1/auth/register`,
        { firstName, lastName, email, password, gender, studentId, phone }
      );
      if (res.data.success) {
        toast.success(res.data.message);

        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <SimpleLayout title={"Register - QuickFoodBite"}>
      <div className="register-container">
        <div className="register-form">
          <h1 className="text-center my-4 text-danger">Registration Form</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="firstName"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="form-control px-3"
                id="firstName"
                placeholder="Enter Your Name"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="lastName"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="form-control"
                id="lastName"
                placeholder="Enter Your Last Name"
                required
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="studentId"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                StudentId
              </label>
              <input
  type="text"
  value={studentId}
  onChange={(e) => setStudentId(e.target.value)}
  className="form-control"
  id="studentId"
  placeholder="FA24-BBA-000"
  pattern="^[A-Z]{2}[0-9]{2}-[A-Z]{3}-[0-9]{3}$"
  title="Format must be like FA24-BBA-000"
  required
/>
            </div>
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
            </div>
            <div className="mb-3">
              <label
                htmlFor="phone"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5"
              >
                Phone Number
              </label>
               <input
    type="text"
    value={phone}
    onChange={(e) => {
      const value = e.target.value;

      // Allow only numbers
      if (/^\d*$/.test(value)) {
        setPhone(value);
      }
    }}
    className="form-control"
    id="phone"
    placeholder="03XXXXXXXXX"
    pattern="^0\d{10}$"
    maxLength={11}
    title="Phone number must be 11 digits and start with 0"
    required
  />
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
            <div className="mb-3 gender-container">
              <label
                htmlFor="gender"
                className="form-label text-danger fw-semibold my-0 ms-1 fs-5 mb-3"
              >
                Gender
              </label>
              <div>
                <div className="form-check form-check-inline">
                  <input
                    className="mx-2"
                    type="radio"
                    name="gender"
                    value="male"
                    onChange={(e) => setGender(e.target.value)}
                    id="genderMale"
                    required
                  />
                  <label
                    className="form-check-label radio-label"
                    htmlFor="genderMale"
                  >
                    Male
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="mx-2"
                    type="radio"
                    name="gender"
                    value="female"
                    onChange={(e) => setGender(e.target.value)}
                    id="genderFemale"
                    required
                  />
                  <label
                    className="form-check-label radio-label"
                    htmlFor="genderFemale"
                  >
                    Female
                  </label>
                </div>
                <div className="form-check form-check-inline">
                  <input
                    className="mx-2"
                    type="radio"
                    name="gender"
                    value="other"
                    onChange={(e) => setGender(e.target.value)}
                    id="genderOther"
                    required
                  />
                  <label
                    className="form-check-label radio-label"
                    htmlFor="genderOther"
                  >
                    Other
                  </label>
                </div>
              </div>
            </div>
            <button type="submit" className="btn btn-danger">
              Submit
            </button>
            <div className="container mt-3">
              <p>
                Already have an account?{" "}
                <Link to="/login" className="text-danger fw-semibold">
                  Log In
                </Link>
              </p>
            </div>
          </form>
        </div>
        {/* <div className="register-image">
          <img src="/Images/register.png" alt="Registration Illustration" />
        </div> */}
      </div>
    </SimpleLayout>
  );
};

export default Register;
