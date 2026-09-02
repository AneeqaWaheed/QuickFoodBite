import { Link } from "react-router-dom";
import { FaBell, FaShoppingCart } from "react-icons/fa";
import "../../styles/navbar.css";
import { useCart } from "../../context/cart";
import CartPage from "../../Pages/Orders/orders";
import { useSearch } from "../../context/seacrh";

const Navbar = ({ backgroundColor, position }) => {
  const { cart, setCartOpen } = useCart();
  const { searchQuery, setSearchQuery } = useSearch();

  return (
    <>
      <nav
        className="fleent-navbar"
        style={{ backgroundColor, position }}
      >
        <div className="fleent-navbar-inner">
          {/* LEFT: Menu icon + Brand */}
          <div className="fleent-navbar-left">
            {/* <button
              type="button"
              className="fleent-navbar-menu"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M2.5 12.5a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1h-10a.5.5 0 0 1-.5-.5z" />
              </svg>
            </button> */}
<Link className="fleent-navbar-brand" to="/">
              
            
                <img
  src="/Images/FleentLogo.png"
  alt="Fleent"
  className="fleent-navbar-logo"
/>
              
            </Link>
            
          </div>

          {/* CENTER: search */}
      

          {/* RIGHT: bell + cart */}
          <div className="fleent-navbar-right">
            <button
              type="button"
              className="fleent-navbar-bell"
              aria-label="Notifications"
            >
              <FaBell size={17} />
            </button>

            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="fleent-navbar-cart"
              aria-label="Open cart"
            >
              <FaShoppingCart size={15} />
              <span className="fleent-navbar-cart-count">{cart.length}</span>
            </button>
          </div>
        </div>
      </nav>
      <CartPage />
    </>
  );
};

export default Navbar;