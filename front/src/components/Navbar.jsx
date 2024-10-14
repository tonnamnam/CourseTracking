import React from "react";
import "../styles/Navbar.css";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const Navbar = () => {
    return (
        <div className="navbar-container">
            <div className="navbar-right">
                <IconButton>
                    <NotificationsIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <IconButton>
                    <AccountCircleIcon sx={{ fontSize: 30 }} />
                </IconButton>
            </div>
        </div>
    );
};

export default Navbar;