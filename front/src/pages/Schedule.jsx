import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import '../styles/Schedule.css';

const Schedule = () => {
  const [currentSemester, setCurrentSemester] = useState(null);
  const [courses, setCourses] = useState({});
  const [semesters, setSemesters] = useState([]);
  const [courseColors, setCourseColors] = useState({});

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const studentId = localStorage.getItem('studentid');
        const response = await fetch(`http://localhost:5001/api/schedule/${studentId}`);
        const data = await response.json();

        if (data.success) {
          const colors = {};
          data.data.forEach(course => {
            if (!colors[course.courseid]) {
              colors[course.courseid] = getRandomColor();
            }
          });
          setCourseColors(colors);

          const courseBySemester = data.data.reduce((acc, course) => {
            if (!course.day) return acc;

            const semesterId = course.semesterid;
            if (!acc[semesterId]) {
              acc[semesterId] = [];
            }

            acc[semesterId].push({
              id: course.courseid,
              name: course.coursename,
              type: course.courseformat,
              day: course.day,
              startTime: course.starttime,
              endTime: course.endtime,
              color: colors[course.courseid]
            });

            return acc;
          }, {});

          const semesterList = [...new Set(data.data.map(course => course.semesterid))]
            .sort()
            .reverse()
            .map(id => ({
              id: id,
              name: `ภาคเรียนที่ ${id}`
            }));

          setCourses(courseBySemester);
          setSemesters(semesterList);
          setCurrentSemester(semesterList[0]?.id);
        }
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const getRandomColor = () => {
    const colors = ['#4CAF50', '#2196F3', '#9F0D7F', '#FF9800', '#E91E63', '#673AB7', '#3F51B5', '#009688'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Generate time slots with 15-minute intervals
  const timeSlots = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const startTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const endHour = minute === 45 ? hour + 1 : hour;
      const endMinute = minute === 45 ? 0 : minute + 15;
      const endTime = `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
      timeSlots.push(`${startTime}-${endTime}`);
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const timeToMinutes = (time) => {
    if (!time) return 0;
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const findDisplaySlot = (startTime, endTime) => {
    if (!startTime || !endTime) return { startSlot: 0, span: 1 };
  
    const start = timeToMinutes(startTime);
    const end = timeToMinutes(endTime);
    const slotDuration = 15;
    const dayStartMinutes = timeToMinutes('08:00');
    
    // Calculate slot positions
    const startSlot = Math.max(0, Math.floor((start - dayStartMinutes) / slotDuration));
    const span = Math.max(1, Math.ceil((end - start) / slotDuration)); // Ensure at least 1 slot span
  
    return { startSlot, span };
  };
  
  const createDaySchedule = (day) => {
    const schedule = new Array(timeSlots.length).fill(null);
    const semesterCourses = courses[currentSemester] || [];
    
    const dayCourses = semesterCourses.filter(course => 
      course.day?.toLowerCase() === day.toLowerCase()
    );

    dayCourses.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    dayCourses.forEach(course => {
      if (course.startTime && course.endTime) {
        const { startSlot, span } = findDisplaySlot(course.startTime, course.endTime);
        
        let canPlace = true;
        for (let i = startSlot; i < startSlot + span; i++) {
          if (schedule[i] !== null) {
            canPlace = false;
            break;
          }
        }

        if (canPlace) {
          schedule[startSlot] = { ...course, span };
          for (let i = startSlot + 1; i < startSlot + span; i++) {
            schedule[i] = 'spanned';
          }
        }
      }
    });

    return schedule;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="schedule-container">
          <div className="semester-select-container">
            <select
              value={currentSemester || ''}
              onChange={(e) => setCurrentSemester(e.target.value)}
              className="semester-select"
            >
              <option value="">เลือกภาคการศึกษา</option>
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
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 8;
                    return (
                      <th key={hour} colSpan={4} className="schedule-header hour-header">
                        {`${hour.toString().padStart(2, '0')}:00-${(hour + 1).toString().padStart(2, '0')}:00`}
                      </th>
                    );
                  })}
                </tr>
                <tr>
                  <th className="schedule-header"></th>
                  {Array.from({ length: 48 }, (_, i) => (
                    <th key={i} className="schedule-header subslot-header">
                      {(i % 4 === 0) ? '00' : 
                       (i % 4 === 1) ? '15' : 
                       (i % 4 === 2) ? '30' : '45'}
                    </th>
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
      </div>
    </div>
  );
};

export default Schedule;