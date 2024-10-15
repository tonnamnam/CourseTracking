import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
    const [username, setUsername] = useState("Guest");

    // ตัวอย่างการใช้ useEffect สำหรับการจำลองดึงข้อมูลผู้ใช้ที่เข้าสู่ระบบ
    useEffect(() => {
        // สมมุติว่าเราเรียก API เพื่อนำชื่อผู้ใช้
        const fetchUserData = async () => {
            // ดึงข้อมูลผู้ใช้จาก API หรือ service authentication ที่ใช้
            // เช่น const user = await someAuthService.getCurrentUser();
            const user = { name: "ชื่อจริง นามสกุล" }; // ข้อมูลจำลอง
            setUsername(user.name);
        };

        fetchUserData();
    }, []); // useEffect จะรันเพียงครั้งเดียวหลังจาก component mount

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