import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const GeneralLayout = ({
  children,
  title,
  description,
  keywords,
  author,
  minHeight,
}) => {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="Free Web tutorials" />
        <meta name="keywords" content="HTML, CSS, JavaScript" />
        <meta name="author" content="John Doe" />
        <title>{title}</title>
      </Helmet>
      <Navbar backgroundColor="#000000" />
      <main style={{ minHeight: minHeight }}>
        <ToastContainer />
        {children}
      </main>
  
    </div>
  );
};

GeneralLayout.defaultProps = {
  title: "BurgerShop",
  minHeight: "80vh",
  description: "Burger Shop for killing your hunger",
  keywords: "Burger, ecommerce, food, fast food, hunger",
  author: "Amayal Royy",
};

export default GeneralLayout;
