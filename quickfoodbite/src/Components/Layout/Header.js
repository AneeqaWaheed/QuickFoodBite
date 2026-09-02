import Navbar from "./Navbar";
import Hero from "./Hero";
import "../../styles/header.css";

const Header = () => {
  return (
    <>
      <Navbar position="fixed" />
      <Hero />
    </>
  );
};

export default Header;