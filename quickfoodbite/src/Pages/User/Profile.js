import React from "react";
import UserMenu from "../../Components/Layout/UserMenu";
import GeneralLayout from "../../Components/Layout/GeneralLayout";

const Profile = () => {
  return (
    <GeneralLayout title={"My Profile"}>
      <div className="container-fluid p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">Profile</div>
        </div>
      </div>
    </GeneralLayout>
  );
};

export default Profile;
