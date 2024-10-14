import React from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx"
import "../styles/Homepage.css";

const HomePage = () => {
    return (
        <div className="homepage-container">
            <Sidebar />
            <Navbar />
            <div className="content">
                <div className="container">
                    <div className="stat-box">
                        <p>หน่วยกิตทั้งหมด</p>
                        <h2>4,000</h2>
                    </div>
                    <div className="stat-box">
                        <p>หน่วยกิตที่เรียนไปแล้ว</p>
                        <h2>3,999</h2>
                    </div>
                    <div className="stat-box">
                        <p>หน่วยกิตที่ขาด</p>
                        <h2>1</h2>
                    </div>
                    <div className="stat-box">
                        <p>GPA</p>
                        <h2>4.00</h2>
                    </div>
                    <div className="stat-box">
                        <p>GPS 1/2566</p>
                        <h2>5.99</h2>
                    </div>
                </div>
                <div className="info-box">
                    <h3>GENED</h3>
                    <p>ที่ต้องเรียน ... หน่วยกิต</p>
                    <p>ที่เรียนไปแล้ว ... หน่วยกิต</p>
                    <p>ขาดอีก ... หน่วยกิต</p>
                </div>
                <div className="info-box">
                    <h3>วิชาภาค</h3>
                    <p>ที่ต้องเรียน ... หน่วยกิต</p>
                    <p>ที่เรียนไปแล้ว ... หน่วยกิต</p>
                    <p>ขาดอีก ... หน่วยกิต</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;