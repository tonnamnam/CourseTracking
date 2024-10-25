import React, { useState } from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import '../styles/Schedule.css';

const Schedule = () => {
  const [currentSemester, setCurrentSemester] = useState('1/2565');
  
  const semesters = [
    { id: '1/2565', name: 'ภาคเรียนที่ 1/2565' },
    { id: '2/2565', name: 'ภาคเรียนที่ 2/2565' },
    { id: '1/2566', name: 'ภาคเรียนที่ 1/2566' }
  ];

  const courseData = {
    '1/2565': [
      { id: 'CS101', name: 'COMPUTER ETHICS: SOCIAL AND PROFESSIONAL ISSUES', type: 'ทฤษฎี', day: 'จันทร์', startTime: '09:00', endTime: '11:00', color: '#4CAF50' },
      { id: 'CS101', name: 'การเขียนโปรแกรม 1', type: 'ปฏิบัติ', day: 'จันทร์', startTime: '14:00', endTime: '16:00', color: '#4CAF50' },
      { id: 'CS102', name: 'คณิตศาสตร์คอมพิวเตอร์', type: 'ทฤษฎี', day: 'อังคาร', startTime: '08:00', endTime: '10:00', color: '#2196F3' },
      { id: 'CS103', name: 'การเขียนโปรแกรมจ้า', type: 'ทฤษฎี', day: 'เสาร์', startTime: '08:00', endTime: '18:00', color: '#9F0D7F' },
    ]
  };

  const timeSlots = [
    '8:00-9:00', 
    '9:00-10:00', 
    '10:00-11:00', 
    '11:00-12:00', 
    '12:00-13:00', 
    '13:00-14:00', 
    '14:00-15:00', 
    '15:00-16:00', 
    '16:00-17:00', 
    '17:00-18:00', 
    '18:00-19:00', 
    '19:00-20:00'
  ];
  
  const days = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

  const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findDisplaySlot = (startTime, endTime) => {
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    
    let startSlot = 0;
    let span = 0;

    // หาช่องเริ่มต้น
    for (let i = 0; i < timeSlots.length; i++) {
      const [slotStart] = timeSlots[i].split('-').map(timeToMinutes);
      if (start >= slotStart && (i === timeSlots.length - 1 || start < timeToMinutes(timeSlots[i + 1].split('-')[0]))) {
        startSlot = i;
        break;
      }
    }

    // หาจำนวนช่องที่ต้อง span
    for (let i = startSlot; i < timeSlots.length; i++) {
      const [, slotEnd] = timeSlots[i].split('-').map(timeToMinutes);
      if (end <= slotEnd) {
        span = i === startSlot ? 1 : i - startSlot + 1; // ปรับการ span ให้ถูกต้อง
        break;
      }
    }

    return { startSlot, span };
  };

  const createDaySchedule = (day) => {
    const schedule = new Array(timeSlots.length).fill(null);
    const courses = courseData[currentSemester]?.filter(course => course.day === day) || [];
    
    courses.forEach(course => {
      const { startSlot, span } = findDisplaySlot(course.startTime, course.endTime);
      schedule[startSlot] = { ...course, span };
      // ทำเครื่องหมายช่องที่ถูก span
      for (let i = startSlot + 1; i < startSlot + span; i++) {
        schedule[i] = 'spanned';
      }
    });
    
    return schedule;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
          <div className="schedule-container">
            <div className="semester-select-container mb-6">
              <select
                value={currentSemester}
                onChange={(e) => setCurrentSemester(e.target.value)}
                className="semester-select"
              >
                {semesters.map(semester => (
                  <option key={semester.id} value={semester.id}>
                    {semester.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="schedule-table-container">
              <table className="schedule-table">
                <thead>
                  <tr>
                    <th className="schedule-header">วัน/เวลา</th>
                    {timeSlots.map(slot => (
                      <th key={slot} className="schedule-header">{slot}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {days.map(day => {
                    const schedule = createDaySchedule(day);
                    return (
                      <tr key={day}>
                        <td className="schedule-cell">{day}</td>
                        {schedule.map((item, index) => {
                          if (item === 'spanned') return null;
                          if (item) {
                            return (
                              <td
                                key={index}
                                className="schedule-cell"
                                colSpan={item.span}
                                style={{ position: 'relative' }} // จัดการตำแหน่ง
                              >
                                <div 
                                  className="course-card" 
                                  style={{ backgroundColor: item.color }}
                                >
                                  <div className="course-name">{item.name}</div>
                                  <div className="course-type">{item.type}</div>
                                  <div className="course-time">{`${item.startTime}-${item.endTime}`}</div>
                                </div>
                              </td>
                            );
                          }
                          return <td key={index} className="schedule-cell" />;
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Schedule;