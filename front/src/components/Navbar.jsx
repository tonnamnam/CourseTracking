import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
    const [username, setUsername] = useState("Guest");

    useEffect(() => {
        const fetchUserData = async () => {
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5000/api/student-details?studentid=${studentid}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUsername(`${data.name} ${data.surname}`); // ตั้งค่า username ด้วย Name และ Surname
                    } else {
                        console.log('Fail to fetch user data');
                    }
                } catch (error) {
                    console.log('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="navbar-container">
            <div className="navbar">
                <IconButton>
                    <NotificationsIcon sx={{ fontSize: 30 }} />
                </IconButton>
                <p>{username}</p>
            </div>
        </div>
    );
};

export default Navbar;