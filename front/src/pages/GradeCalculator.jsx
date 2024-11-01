import React, { useState } from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import '../styles/GradeCalculator.css';

const GradeCalculator = () => {
  const [courses, setCourses] = useState([{ subject: '', credits: '', grade: 'A' }]);
  const [showResult, setShowResult] = useState(false);
  const [gpaResult, setGpaResult] = useState('0.00');

  const addCourse = () => {
    setCourses([...courses, { subject: '', credits: '', grade: 'A' }]);
  };

  const removeCourse = (index) => {
    setCourses(courses.filter((_, i) => i !== index));
  };

  const handleChange = (index, field, value) => {
    setCourses(courses.map((course, i) => i === index ? { ...course, [field]: value } : course));
    setShowResult(false); // Hide result when user makes changes
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    const gradePoints = { 'A': 4.0, 'B+': 3.5, 'B': 3.0, 'C+': 2.5, 'C': 2.0, 'D+': 1.5, 'D': 1.0, 'F': 0 };

    courses.forEach(course => {
      if (course.credits && course.grade) {
        const credits = parseFloat(course.credits);
        totalPoints += credits * gradePoints[course.grade];
        totalCredits += credits;
      }
    });

    const result = totalCredits === 0 ? '0.00' : (totalPoints / totalCredits).toFixed(2);
    setGpaResult(result);
    setShowResult(true);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <div className="grade-calculator-container">
          <div className="grade-calculator-content">
            <div className="calculator-header">
              <h1 className="calculator-title">เครื่องคำนวณเกรดเฉลี่ย</h1>
            </div>
            
            {courses.map((course, index) => (
              <div key={index} className="course-row">
                <input
                  type="text"
                  placeholder="ชื่อวิชา (ไม่จำเป็น)"
                  value={course.subject}
                  onChange={(e) => handleChange(index, 'subject', e.target.value)}
                  className="input-field subject-input"
                />
                <input
                  type="number"
                  placeholder="หน่วยกิต"
                  value={course.credits}
                  onChange={(e) => handleChange(index, 'credits', e.target.value)}
                  className="input-field credits-input"
                />
                <select
                  value={course.grade}
                  onChange={(e) => handleChange(index, 'grade', e.target.value)}
                  className="select-field"
                >
                  <option value="A">A</option>
                  <option value="B+">B+</option>
                  <option value="B">B</option>
                  <option value="C+">C+</option>
                  <option value="C">C</option>
                  <option value="D+">D+</option>
                  <option value="D">D</option>
                  <option value="F">F</option>
                </select>
                {courses.length > 1 && (
                  <button 
                    onClick={() => removeCourse(index)} 
                    className="button remove-button"
                    aria-label="ลบรายวิชา"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
            
            <div className="action-row">
              <button 
                onClick={addCourse} 
                className="button add-button"
                aria-label="เพิ่มรายวิชา"
              >
                +
              </button>
              <button 
                onClick={calculateGPA} 
                className="button calculate-button"
              >
                คำนวณ
              </button>
              {showResult && (
                <div className="gpa-result">
                  เกรดเฉลี่ย: {gpaResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeCalculator;