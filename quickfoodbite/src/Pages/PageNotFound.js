import React from "react";
import { Link } from "react-router-dom";
import GeneralLayout from "../Components/Layout/GeneralLayout";
import { IoIosArrowBack } from "react-icons/io";
const PageNotFound = () => {
  return (
    <GeneralLayout title="PageNotFound">
      <div className="pnf">
        <img src="/Images/404.PNG" alt="" />
        <h2 className="pnf-heading">Oops ! Page Not Found</h2>
        <Link to="/" className="fw-bold btn btn-danger">
          <IoIosArrowBack className="fs-3" />
          Go Back
        </Link>
      </div>
    </GeneralLayout>
  );
};

export default PageNotFound;
