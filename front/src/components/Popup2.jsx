import React, { useState } from "react";
import "../styles/Popup.css";

const Popup2 = ({ title, subjectsByCategory, closePopup }) => {
    const [selectedTab, setSelectedTab] = useState("completedRequired");

    const toggleTab = (tab) => {
        setSelectedTab(tab);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>{title}</h3>
                
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

                <button onClick={closePopup}>Close</button>
            </div>
        </div>
    );
};

export default Popup2;