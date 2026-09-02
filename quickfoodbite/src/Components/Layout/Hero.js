import { Link } from "react-router-dom";
import "../../styles/Hero.css";

const Hero = () => {
  return (
    <section className="fleent-hero">
      <div className="fleent-hero-bar" />

      <div className="fleent-hero-inner">

        {/* TOP: Copy + Image */}
        <div className="fleent-hero-main">

          {/* LEFT: copy */}
          <div className="fleent-hero-copy">
            {/*  */}

            <h1 className="fleent-hero-heading">
              HUNGRY OR TIRED?
              <br />
              <span className="fleent-hero-accent">FLEENT</span> WILL MANAGE.
            </h1>

            <p className="fleent-hero-sub">
              Your wish. Delivered to you.
            </p>
          </div>

          {/* RIGHT: image */}
          <div className="fleent-hero-art">
            <img
              src="/Images/FleentLanding.png"
              alt="Fleent food delivery"
              className="header-image"
            />
          </div>

        </div>

        {/* BOTTOM: Full-width search */}
        <form
          className="fleent-hero-search"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="text"
            placeholder="What are you craving today?"
            aria-label="Search for food"
          />
          <button type="submit">Search</button>
        </form>

      </div>
    </section>
  );
};

export default Hero;
