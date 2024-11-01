import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon from Material-UI
import "../styles/Popup.css";

const Popup = ({ title, completedSubjects, uncompletedSubjects, closePopup }) => {
    const [selectedTab, setSelectedTab] = useState("completed");

    const toggleTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="header">
                    <div className="popup-header">
                        <h3>{title}</h3>
                        <CloseIcon className="close-icon" onClick={closePopup} />
                    </div>

                    {/* Toggle buttons */}
                    <div className="toggle-buttons">
                        <button
                            className={selectedTab === "completed" ? "active" : ""}
                            onClick={() => toggleTab("completed")}
                        >
                            วิชาเลือกที่เรียนไปแล้ว
                        </button>
                        <button
                            className={selectedTab === "uncompleted" ? "active" : ""}
                            onClick={() => toggleTab("uncompleted")}
                        >
                            วิชาเลือกที่ยังไม่เรียน
                        </button>
                    </div>
                </div>
                {/* Table content based on selected tab */}
                <div className="popup-table">
                    <table>
                        <thead>
                            <tr>
                                <th>รหัสวิชา</th>
                                <th>ชื่อวิชา</th>
                                <th>หน่วยกิต</th>
                                <th>เกรด</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(selectedTab === "completed" ? completedSubjects : uncompletedSubjects).map((subject, index) => (
                                <tr key={index}>
                                    <td>{subject.code}</td>
                                    <td>{subject.name}</td>
                                    <td>{subject.credits}</td>
                                    <td>{subject.grade}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Popup;