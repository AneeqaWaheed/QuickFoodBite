
import Navbar from "./Navbar";
import "../../styles/header.css";

const Header = () => {
  return (
    <>
      <Navbar position="fixed" />
      <section className="header-section m-0 mb-0 p-0">
        <img
          src="/Images/header1.jpg"
          alt="Delicious food dishes displayed for QuickFoodBite homepage banner"
          className="header-image"
        />
        <div className="header-text">
          <h1>QUICKFOODBITE</h1>
          <p>Where Every Bite is a Flavor Explosion.</p>
        
        </div>
      </section>
    </>
  );
};

export default Header;
