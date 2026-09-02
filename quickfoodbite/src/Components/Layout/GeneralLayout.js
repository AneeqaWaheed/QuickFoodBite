
import Navbar from "./Navbar";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const GeneralLayout = ({
  children,
  title,

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
  title: "Fleent",
  minHeight: "80vh",
  description: "Fleent for killing your hunger",
  keywords: "Burger, ecommerce, food, fast food, hunger",
  author: "Aneeqa",
};

export default GeneralLayout;
