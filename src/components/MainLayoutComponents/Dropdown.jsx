import React from "react";
import { Link } from "react-router-dom";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

export default function Dropdown(props) {
  const { anchorEl, handleDropdownClose, clearToken } = props.dropdownProps;

  return (
    <div>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
      >
        <Link to="/edit-profile">
          <MenuItem onClick={handleDropdownClose}>Edit Profile</MenuItem>
        </Link>
        <Link to="/account">
          <MenuItem onClick={handleDropdownClose}>My account</MenuItem>
        </Link>
        <Link to="/">
          <MenuItem onClick={clearToken}>Logout</MenuItem>
        </Link>
      </Menu>
    </div>
  );
}
