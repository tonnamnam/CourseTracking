import React from "react";
import "../styles/Sidebar.css";
import { Typography, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

const Sidebar = () => {
    return (
        <div className="sidebar-container">
            <img src="/src/assets/KMITL_LOGO.png" alt="KMITL Logo" className="logo" />
            <Typography variant="h6" className="sidebar-title">
                พระจอมเกล้าลาดกระบัง
            </Typography>
            <List sx={{ width: "100%" }}>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary="HOME" />
                    </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                    <ListItemButton>
                        <ListItemText primary="ตารางเรียน" />
                    </ListItemButton>
                </ListItem>
            </List>
        </div>
    );
};

export default Sidebar;