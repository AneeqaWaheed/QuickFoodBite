import React from "react";
import GeneralLayout from "../../Components/Layout/GeneralLayout";
import UserMenu from "../../Components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
  const [auth] = useAuth();
  return (
    <GeneralLayout title={"Dashboard"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h3 className=" m-3 mt-5">
              WELLCOME{" "}
              <span className="text-danger">
                "{auth?.user?.firstName + " " + auth?.user?.lastName}"
              </span>
            </h3>
            <p className=" mx-4">
              We really happy for your contribution to the Application{" "}
            </p>
          </div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default Dashboard;
