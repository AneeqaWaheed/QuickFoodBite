
import {  Link } from "react-router-dom";
import { FaBurger } from "react-icons/fa6";

import "../../styles/navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { useCart } from "../../context/cart";
import CartPage from "../../Pages/Orders/orders";
import { useSearch } from "../../context/seacrh";
const Navbar = ({ backgroundColor, position }) => {
  const { cart, setCartOpen, } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <>
     <nav
  className="navbar navbar-expand-lg bg-light"
  style={{ backgroundColor, position }}
>
  <div className="container-fluid d-flex align-items-center justify-content-between flex-nowrap">

    {/* LEFT: Menu icon + Brand */}
    <div className="d-flex align-items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="30"
        height="30"
        fill="#FFFFFF"
        viewBox="0 0 16 16"
        style={{ cursor: "pointer" }}
      >
        <path d="M2.5 12.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z" />
      </svg>

     <Link
  className="navbar-brand fw-bold d-flex align-items-center gap-1"
  to="/"
  style={{ color: "rgb(225 29 72)" }}
>
  <FaBurger className="faburger" />
  <span className="brand-text">QUICKFOODBITE</span>
</Link>
    </div>
    <div className="flex-grow-1 d-flex justify-content-center">
  <input
    type="text"
    placeholder="Search food..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="form-control"
    style={{
      maxWidth: "250px",
      width: "100%",
      minWidth: "120px",
    }}
  />
</div>
    {/* RIGHT: Cart */}
    <div
      onClick={() => setCartOpen(true)}
      className="px-3 py-2 bg-danger text-white rounded-pill shadow d-flex align-items-center"
      style={{ cursor: "pointer" }}
    >
      <FaShoppingCart className="me-1" />
      {cart.length}
    </div>

  </div>
</nav>
      <CartPage />
    </>
  );
};

export default Navbar;
