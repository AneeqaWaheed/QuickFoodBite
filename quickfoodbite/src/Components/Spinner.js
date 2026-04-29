import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const Spinner = ({ path = "login" }) => {
  const [count, setCount] = useState(3);
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((preValue) => --preValue);
    }, 1000);
    count === 0 && navigate(`/login`, {});
    return () => clearInterval(interval);
  }, [count, navigate, location]);
  return (
    <>
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column">
        <h4 className="text-danger">Redirecting you in {count} seconds</h4>
        <div className="spinner-border text-danger" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
};

export default Spinner;
