import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/AdminMenu.css";
const UserMenu = () => {
  return (
    <>
      <div className="text-center">
        <div class="list-group">
          <h4>User Panel</h4>
          <div>
            {/* <NavLink
              to="/dashboard/user/profile"
              aria-current="page"
              className="list-group-item list-group-item-action "
              activeClassName="active-link"
            >
              Profile
            </NavLink> */}
            <NavLink
              to="/dashboard/user/orders"
              className="list-group-item list-group-item-action "
            >
              Orders
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserMenu;
