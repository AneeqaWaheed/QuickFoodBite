
import {  Link } from "react-router-dom";
import { FaBurger } from "react-icons/fa6";

import "../../styles/navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/cart";
import CartPage from "../../Pages/Orders/orders";
const Navbar = ({ backgroundColor, position }) => {
  const { cart, setCartOpen, } = useCart();

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-light"
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
            <Link
  className="navbar-brand fw-bold"
  to="/"
  style={{ color: "rgb(225 29 72)" }}
>
  <FaBurger className="faburger" />
  QUICKFOODBITE
</Link>
           
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
             
              <li className="nav-item">
        <div onClick={() => setCartOpen(true)}>
    <span className="cart-circle">
      <>
      <FaShoppingCart /> ({cart.length})
     
      </>
    </span>

  

  </div>


              </li>
            </ul>
          </div>
        </div>
      </nav>
      <CartPage />
    </>
  );
};

export default Navbar;
