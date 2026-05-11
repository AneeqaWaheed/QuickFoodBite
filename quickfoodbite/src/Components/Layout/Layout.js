import Header from "./Header";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../styles/layout.css";
import headerImg from "../../assets/header1.jpg";

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

      {/* MOBILE BLUR BACKGROUND LAYER */}
      <div
  className="mobile-bg-overlay"
  style={{ backgroundImage: `url(${headerImg})` }}
></div>

      <main className="main-content">
        <ToastContainer />
        {children}
      </main>
    </div>
  );
};

Layout.defaultProps = {
  title: "QUICK FOOD BITE",
  description: "QUICK FOOD BITE for killing your hunger",
  keywords: "BITE, ecommerce, food, fast food, hunger",
  author: "Aneeqa",
};

export default Layout;