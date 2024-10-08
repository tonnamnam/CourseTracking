// sidebar.jsx
import React from "react";
import "../styles/Sidebar.css";
import { Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <img src="/src/assets/KMITL_LOGO.png" alt="KMITL Logo" className="logo" />
            </div>
            <div className="sidebar-menu">
                <List sx={{ width: "100%" }}>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Typography>HOME</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton>
                            <Typography>ตารางเรียน</Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
            </div>
        </div>
    );
};

export default Sidebar;
