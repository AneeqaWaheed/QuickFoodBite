
import Header from "./Header";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const Layout = ({ children, title, description, keywords, author }) => {
  return (
    <div>
      <Header />
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <main style={{ minHeight: "80vh" }}>
        <ToastContainer />
        {children}
      </main>
      {/* <Footer /> */}
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
