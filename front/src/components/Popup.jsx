import React from 'react';
import '../styles/Popup.css';

const Popup = ({ closePopup, title, subjects }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{title}</h2>
                <button onClick={closePopup} className="close-button">ปิด</button>
                <ul>
                    {subjects.map((subject, index) => (
                        <li key={index}>{subject}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Popup;
