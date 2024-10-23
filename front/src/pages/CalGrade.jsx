// import React, { useState, useEffect } from 'react';
// import Sidebar from "../components/Sidebar.jsx";
// import Navbar from "../components/Navbar.jsx";
// import axios from 'axios';

// const Schedule = () => {
//     const [term, setTerm] = useState('GPS 1/2566'); // เทอมเริ่มต้น
//     const [schedule, setSchedule] = useState([]);

//     useEffect(() => {
//         // Fetch data เมื่อเทอมเปลี่ยน
//         const fetchSchedule = async () => {
//             try {
//                 const response = await axios.get('/api/schedule', {
//                     params: {
//                         studentid: 'student-id-here', // ใส่ StudentID ของนักศึกษา
//                         term: term
//                     }
//                 });
//                 setSchedule(response.data);
//             } catch (error) {
//                 console.error('Error fetching schedule:', error);
//             }
//         };
//         fetchSchedule();
//     }, [term]);

//     const handleTermChange = (e) => {
//         setTerm(e.target.value);
//     };

//     return (
//         <div>
//             <Sidebar />
//             <Navbar />
// <div className="content">
//     <select value={term} onChange={handleTermChange}>
//         <option value="GPS 1/2566">GPS 1/2566</option>
//         <option value="GPS 2/2567">GPS 2/2567</option>
//     </select>
//     <table>
//         <thead>
//             <tr>
//                 <th>วัน</th>
//                 <th>เวลา</th>
//                 <th>วิชา</th>
//                 <th>อาจารย์</th>
//             </tr>
//         </thead>
//         <tbody>
//             {schedule.map((classItem, index) => (
//                 <tr key={index}>
//                     <td>{classItem.day}</td>
//                     <td>{classItem.time}</td>
//                     <td>{classItem.subject}</td>
//                     <td>{classItem.instructor}</td>
//                 </tr>
//             ))}
//         </tbody>
//     </table>
// </div>
//         </div>
//     );
// }
// export default Schedule;
import React from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx"

const CalGrade = () => {
    return (
        <div>
            <Sidebar />
            <Navbar />
        </div>
    );
}
export default CalGrade;