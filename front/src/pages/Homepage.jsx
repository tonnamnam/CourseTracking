import React, { useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../styles/Homepage.css";
import { Select, MenuItem } from "@mui/material";

const HomePage = () => {
    const [selectedGPS, setSelectedGPS] = useState("1/2566");

    const handleGPSChange = (event) => {
        setSelectedGPS(event.target.value);
    };

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
                        <Select
                            value={selectedGPS}
                            onChange={handleGPSChange}
                            variant="standard"
                        >
                            <MenuItem value="1/2566"><p>GPS 1/2566</p></MenuItem>
                            <MenuItem value="2/2567"><p>GPS 2/2567</p></MenuItem>
                        </Select>
                        <h2>{selectedGPS === "1/2566" ? "5.99" : "6.00"}</h2>
                    </div>
                </div>
                <div className="container">
                    <div className="info-box">
                        <div className="container-head">
                            <h3>GENED</h3><p>ดูวิชาเรียน</p>
                        </div>
                        <div className="info-row">
                            <p1>ที่ต้องเรียน</p1>
                            <p>89</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p1>ที่เรียนไปแล้ว</p1>
                            <p>8</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p1>ขาดอีก</p1>
                            <p>81</p>
                            <p>หน่วยกิต</p>
                        </div>
                    </div>
                    <div className="info-box">
                        <div className="container-head">
                            <h3>วิชาภาค</h3><p>ดูวิชาเรียน</p>
                        </div>
                        <div className="info-row">
                            <p1>ที่ต้องเรียน</p1>
                            <p>89</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p1>ที่เรียนไปแล้ว</p1>
                            <p>889</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p1>ขาดอีก</p1>
                            <p>81</p>
                            <p>หน่วยกิต</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;