import React from "react";
import "../styles/Sidebar.css";
import { Typography, List, ListItem, ListItemButton } from "@mui/material";
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();  // Hook for navigation

    const handleLogout = () => {
        localStorage.removeItem('studentid');
        // Add your logout logic here, e.g., clear user session, token, etc.
        console.log("User logged out");
        // After logout, you might want to navigate to the login page or home
        navigate('/');  // Adjust the route based on your app structure
    };

    return (
        <div className="sidebar-container">
            <div className="sidebar-header">
                <img src="/src/assets/KMITL_LOGO.png" alt="KMITL Logo" className="logo" />
            </div>
            <div className="sidebar-menu" style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <List sx={{ width: "100" }}>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ marginBottom: 1 }} onClick={() => navigate('/home')}>
                            <Typography>HOME</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ marginBottom: 1 }} onClick={() => navigate('/schedule')}>
                            <Typography>ตารางเรียน</Typography>
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ marginBottom: 1 }} onClick={() => navigate('/calgrade')}>
                            <Typography>คำนวณเกรด</Typography>
                        </ListItemButton>
                    </ListItem>
                </List>
                {/* Add the Logout button here */}
                <ListItem disablePadding>
                    <ListItemButton onClick={handleLogout}>
                        <Typography>Logout</Typography>
                    </ListItemButton>
                </ListItem>
            </div>
        </div>
    );
};

export default Sidebar;
