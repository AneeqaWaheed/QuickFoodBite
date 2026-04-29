import React from "react";
import "../styles/FounderSays.css"; // Import your custom CSS file

const FounderSays = () => {
  return (
    <div className="container-fluid py-3 my-4 bg-danger-subtle">
      <div className="container bg-white p-4 my-4">
        <div className="row align-items-center text-center">
          <div className="col-md-3 my-4">
            <img
              src="Images/Founder.jpg"
              alt="Founder"
              className="img-fluid rounded-circle mx-auto d-block"
            />
          </div>
          <div className="col-md-9 text-center">
            <p className="founder-text text-start m-4">
              “The success of your business is ultimately down to how
              effectively your people can work. Which is why our workspace
              solutions offer more choice, greater flexibility and an easy way
              to move towards a hybrid way of working. We look forward to
              helping you embrace this new world of work.”
            </p>
            <p className="FounderName text-start ms-4">Mark Dixon</p>
            <p className="FDes text-start ms-4">Founder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FounderSays;
