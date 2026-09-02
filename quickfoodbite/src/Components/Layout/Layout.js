import Header from "./Header";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/layout.css";
import { NavLink } from "react-router-dom";
import { FaHome, FaSearch, FaClipboardList, FaTag, FaUser } from "react-icons/fa";

const navItems = [
  { label: "Home", to: "/", Icon: FaHome },
  { label: "Explore", to: "/explore", Icon: FaSearch },
  { label: "Orders", to: "/orders", Icon: FaClipboardList },
  { label: "Deals", to: "/deals", Icon: FaTag },
  { label: "Account", to: "/account", Icon: FaUser },
];

const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div className="app-layout">
      <Header />

      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      <main className="main-content">
        <ToastContainer
          position="top-right"
          style={{ zIndex: 999999 }}
          toastClassName="fleent-toast"
        />
        {children}
      </main>

      {/* Persistent bottom nav, same on every page, matching the reference UI */}
      
    </div>
  );
};

Layout.defaultProps = {
  title: "FLEENT | Your Wish. Delivered.",
  description: "Fleent delivers your wish to you — food, groceries and more.",
  keywords: "fleent, food delivery, ecommerce, fast food, hunger",
  author: "Aneeqa",
};

export default Layout;