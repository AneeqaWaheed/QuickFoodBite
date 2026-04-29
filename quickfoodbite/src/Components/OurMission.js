import React from "react";
import "../styles/Mission.css";
const OurMission = () => {
  return (
    <>
      <div className="container p-4 my-4">
        <h1 className="msn ms-4">OUR MISSION</h1>

        <p className="ms-4 fs-6 text-body-secondary">
          Our mission is simple: to delight our customers with irresistible
          flavors, impeccable service, and a welcoming atmosphere. We are
          committed to preserving Spain’s rich culinary heritage while embracing
          creativity and innovation in our menu offerings. Whether you’re
          craving classic paella or are exploring our seasonal specialties, we
          invite you to savor a taste of Spain with us.
        </p>
        <img src="/Images/mission.jpg" alt="" className="ms-4 mission-img" />
      </div>
    </>
  );
};

export default OurMission;
