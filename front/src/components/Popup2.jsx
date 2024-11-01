import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close"; // Import the Close icon from Material-UI
import "../styles/Popup.css";

const Popup2 = ({ title, subjectsByCategory, closePopup }) => {
    const [selectedTab, setSelectedTab] = useState("completedRequired");

    const toggleTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="popup-overlay" onClick={closePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <div className="popup-header">
                    <h3>{title}</h3>
                    <CloseIcon className="close-icon" onClick={closePopup} /> {/* Use Material-UI CloseIcon */}
                </div>

                {/* Four toggle buttons */}
                <div className="toggle-buttons">
                    <button
                        className={selectedTab === "completedRequired" ? "active" : ""}
                        onClick={() => toggleTab("completedRequired")}
                    >
                        วิชาบังคับที่เรียนไปแล้ว
                    </button>
                    <button
                        className={selectedTab === "uncompletedRequired" ? "active" : ""}
                        onClick={() => toggleTab("uncompletedRequired")}
                    >
                        วิชาบังคับที่ยังไม่เรียน
                    </button>
                    <button
                        className={selectedTab === "completedOptional" ? "active" : ""}
                        onClick={() => toggleTab("completedOptional")}
                    >
                        วิชาเลือกที่เรียนไปแล้ว
                    </button>
                    <button
                        className={selectedTab === "uncompletedOptional" ? "active" : ""}
                        onClick={() => toggleTab("uncompletedOptional")}
                    >
                        วิชาเลือกที่ยังไม่เรียน
                    </button>
                </div>

                {/* Table content based on selected tab */}
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
                        {(subjectsByCategory[selectedTab] || []).map((subject, index) => (
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
    );
};

export default Popup2;