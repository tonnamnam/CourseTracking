import React, { useState, useEffect } from "react";
import "../styles/Navbar.css";
import { IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";

const Navbar = () => {
    const [username, setUsername] = useState("Guest");
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);

    // ฟังก์ชันสำหรับแปลงวันที่เป็นรูปแบบไทย
    const formatThaiDate = (dateString) => {
        if (!dateString) return null;

        const date = new Date(dateString);
        const thaiMonths = [
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        const day = date.getDate();
        const month = thaiMonths[date.getMonth()];
        const year = date.getFullYear() + 543; // แปลงเป็นพ.ศ.

        return `${day} ${month} ${year}`;
    };

    // ดึงข้อมูล notifications
    // ในส่วนของ useEffect ที่ดึงข้อมูล notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/notifications');
                const data = await response.json();

                // แปลงข้อมูลให้อยู่ในรูปแบบที่ต้องการ
                const formattedNotifications = data.map(notification => {
                    const startDate = formatThaiDate(notification.startdate);
                    const endDate = formatThaiDate(notification.enddate);

                    return {
                        id: notification.notificationid,
                        text: notification.detail,
                        // แสดงแค่วันที่เริ่มถ้าไม่มี enddate
                        time: endDate ? `${startDate} - ${endDate}` : startDate
                    };
                });

                setNotifications(formattedNotifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        fetchNotifications();

        // เพิ่ม interval เพื่อ refresh notifications ทุก 5 นาที
        const interval = setInterval(fetchNotifications, 300000);

        // Cleanup interval เมื่อ component unmount
        return () => clearInterval(interval);
    }, []);

    // ดึงข้อมูล user
    useEffect(() => {
        const fetchUserData = async () => {
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5001/api/student-details?studentid=${studentid}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUsername(`${data.name} ${data.surname}`);
                    }
                    else {
                        console.log('Fail to fetch user data');
                    }
                } catch (error) {
                    console.log('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNotifications && !event.target.closest('.notification-container')) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showNotifications]);

    return (
        <div className="navbar-container">
            <div className="navbar">
                <div className="notification-container">
                    <IconButton
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowNotifications(!showNotifications);
                        }}
                    >
                        <NotificationsIcon sx={{ fontSize: 30 }} />
                        {notifications.length > 0 && (
                            <span className="notification-badge">
                                {notifications.length}
                            </span>
                        )}
                    </IconButton>

                    {showNotifications && (
                        <div className="notification-popup">
                            <div className="notification-header">
                                <h3>การแจ้งเตือน</h3>
                            </div>
                            <div className="notification-list">
                                {notifications.map((notification) => (
                                    <div key={notification.id} className="notification-item">
                                        <p>{notification.text}</p>
                                        <span className="notification-time">{notification.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <p>{username}</p>
            </div>
        </div>
    );
};

export default Navbar;