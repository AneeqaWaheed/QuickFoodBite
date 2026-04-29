import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaBurger } from "react-icons/fa6";
import { useAuth } from "../../context/auth";
import { toast } from "react-toastify";
import "../../styles/navbar.css";
import { useCart } from "../../context/cart";
const Navbar = ({ backgroundColor, textColor, linkColor, position }) => {
  const [auth, setAuth] = useAuth();
  const navigate = useNavigate();
  const { cart, setCart } = useCart();
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
      <nav
        className="navbar navbar-expand-lg "
        style={{ backgroundColor: backgroundColor, position: position }}
      >
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="#FFFFFF" /* Custom icon color */
              className="bi bi-list"
              viewBox="0 0 16 16"
            >
              <path d="M2.5 12.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z" />
            </svg>
          </button>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo01">
            <Link className="navbar-brand text-white fw-bold" to="/">
              <FaBurger className="faburger" />
              QUICKFOODBITE
            </Link>
            {/* <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  className="nav-link  text-white"
                  aria-current="page"
                  to="/home"
                >
                  Home
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link  text-white"
                  aria-current="page"
                  to="/"
                >
                  Menu
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/about">
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/contact" className="nav-link  text-white">
                  Contact
                </NavLink>
              </li>
            </ul> */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
             
              <li className="nav-item">
                <NavLink className="nav-link text-white" to="/cart">
                  Cart {cart.length > 0 ? `(${cart.length})` : "(0)"}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
