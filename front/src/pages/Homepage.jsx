import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../styles/Homepage.css";
import { Select, MenuItem } from "@mui/material";

const HomePage = () => {
    const [selectedGPS, setSelectedGPS] = useState("1/2566");
    const [requiredCredits, setRequiredCredits] = useState(null);
    const [completedCredits,setCompletedCredits] = useState(null);
    const [remainingCredits, setRemainingCredits] = useState(null); // เพิ่ม remainingCredits

    useEffect(() => {
        const fetchCreditsData = async () => {
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5000/api/major-requirements?studentid=${studentid}`);
                    const data = await response.json();
                    if (response.ok) {
                        setRequiredCredits(data.requiredCredits);
                        setCompletedCredits(data.completedCredits);
                        setRemainingCredits(data.remainingCredits);
                    } else {
                        console.error('Failed to fetch credits data:', data.error);
                    }
                } catch (error) {
                    console.error('Error fetching credits data:', error);
                }
            }
        };

        fetchCreditsData();
    }, []);

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
                        <h2>{requiredCredits !== null ? requiredCredits : 'กำลังโหลด...'}</h2>
                    </div>
                    <div className="stat-box">
                        <p>หน่วยกิตที่เรียนไปแล้ว</p>
                        <h2>{completedCredits !== null ? completedCredits : 'กำลังโหลด...'}</h2>
                    </div>
                    <div className="stat-box">
                        <p>หน่วยกิตที่ขาด</p>
                        <h2>{remainingCredits !== null ? remainingCredits : 'กำลังโหลด...'}</h2> {/* แสดง remainingCredits */}
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