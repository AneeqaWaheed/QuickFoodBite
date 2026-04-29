import React from "react";
import { NavLink } from "react-router-dom";
import "../../styles/AdminMenu.css";
const ModeratorMenu = () => {
  return (
    <>
      <div className="text-center">
        <div class="list-group">
          <h4 className="text-white">Moderator Panel</h4>
          <div>
            <NavLink
              to="/dashboard/moderator/My-Profile"
              aria-current="page"
              className="list-group-item list-group-item-action "
              activeClassName="active-link"
            >
              My Profile
            </NavLink>
            <NavLink
              to="/dashboard/moderator/My-orders"
              className="list-group-item list-group-item-action "
            >
              My Orders
            </NavLink>
            {/* <NavLink
              to="/dashboard/admin/product"
              className="list-group-item list-group-item-action "
            >
              Products
            </NavLink> */}
            {/* <NavLink
              to="/dashboard/admin/users"
              className="list-group-item list-group-item-action "
            >
              Users
            </NavLink> */}
            {/* <NavLink
              to="/dashboard/admin/orders"
              className="list-group-item list-group-item-action "
            >
              Orders
            </NavLink>
            <NavLink
              to="/dashboard/admin/charges"
              className="list-group-item list-group-item-action "
            >
              Settings
            </NavLink> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModeratorMenu;
