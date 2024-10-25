import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import "../styles/Homepage.css";
import { Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";

const HomePage = () => {
    const [selectedSemester, setSelectedSemester] = useState(null);
    const [semesters, setSemesters] = useState([]);
    const [requiredCredits, setRequiredCredits] = useState(null);
    const [completedCredits, setCompletedCredits] = useState(null);
    const [remainingCredits, setRemainingCredits] = useState(null);
    const [cumulativeGPA, setCumulativeGPA] = useState(null);

    useEffect(() => {
        const fetchGPSData = async () => {
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5001/api/grade?studentid=${studentid}`);
                    const data = await response.json();
                    if (response.ok) {
                        setSemesters(data.semesters);
                        setSelectedSemester(data.selectedGPS);
                        setCumulativeGPA(data.cumulativeGPA);
                    } else {
                        console.error('Failed to fetch GPS data:', data.error);
                    }
                } catch (error) {
                    console.error('Error fetching GPS data:', error);
                }
            }
        };

        fetchGPSData();
    }, []);

    useEffect(() => {
        const fetchCreditsData = async () => {
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5001/api/major-requirements?studentid=${studentid}`);
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

    const handleSemesterChange = (event) => {
        const selectedSemesterName = event.target.value;
        const selected = semesters.find(sem => sem.semestername === selectedSemesterName);
        if (selected) {
            setSelectedSemester(selected);
        }
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
                        <h2>{remainingCredits !== null ? remainingCredits : 'กำลังโหลด...'}</h2>
                    </div>
                    <div className="stat-box">
                        <p>GPA</p>
                        <h2>{cumulativeGPA !== null ? cumulativeGPA : 'กำลังโหลด...'}</h2>
                    </div>
                    <div className="stat-box">
                        <Select
                            value={selectedSemester?.semestername || ''}
                            onChange={handleSemesterChange}
                            variant="standard"
                            displayEmpty
                            sx={{ minWidth: 120 }}
                        >
                            {semesters.map((semester) => (
                                <MenuItem
                                    key={semester.semestername}
                                    value={semester.semestername}
                                >
                                    <p>GPS {semester.semestername}</p>
                                </MenuItem>
                            ))}
                        </Select>
                        <h2>
                            {selectedSemester && !isNaN(selectedSemester.gps)
                                ? parseFloat(selectedSemester.gps).toFixed(2)
                                : 'กำลังโหลด...'}
                        </h2>
                    </div>
                </div>

                <div className="container">
                    <div className="info-box">
                        <div className="container-head">
                            <h3>GENED</h3>
                            <p>ดูวิชาเรียน</p>
                        </div>
                        <div className="info-row">
                            <p>ที่ต้องเรียน</p>
                            <p>30</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p>ที่เรียนไปแล้ว</p>
                            <p>6</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p>ขาดอีก</p>
                            <p>24</p>
                            <p>หน่วยกิต</p>
                        </div>
                    </div>

                    <div className="info-box">
                        <div className="container-head">
                            <h3>วิชาภาค</h3>
                            <p>ดูวิชาเรียน</p>
                        </div>
                        <div className="info-row">
                            <p>ที่ต้องเรียน</p>
                            <p>105</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p>ที่เรียนไปแล้ว</p>
                            <p>67</p>
                            <p>หน่วยกิต</p>
                        </div>
                        <div className="info-row">
                            <p>ขาดอีก</p>
                            <p>38</p>
                            <p>หน่วยกิต</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;