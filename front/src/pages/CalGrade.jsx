import React, { useState, useEffect } from 'react';
import Sidebar from "../components/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import '../styles/CalGrade.css';

const CalGrade = () => {
    const [totalCreditsUsed, setTotalCreditsUsed] = useState(null);
    const [cumulativeGPA, setCumulativeGPA] = useState(null);
    const [desiredGrade, setDesiredGrade] = useState('');
    const [futureCredits, setFutureCredits] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState('');

    useEffect(() => {
        const fetchCreditsData = async () => {
            setLoading(true);
            const studentid = localStorage.getItem('studentid');
            if (studentid) {
                try {
                    const response = await fetch(`http://localhost:5001/api/grade?studentid=${studentid}`);
                    const data = await response.json();
                    if (response.ok) {
                        setTotalCreditsUsed(data.totalCreditsUsed);
                        setCumulativeGPA(parseFloat(data.cumulativeGPA)); // แปลงเป็น float ทันทีที่ได้ข้อมูล
                    } else {
                        setError('Failed to fetch GPA data.');
                    }
                } catch (error) {
                    setError('Error fetching GPA data.');
                }
            }
            setLoading(false);
        };

        fetchCreditsData();
    }, []);

    const handleCalculate = () => {
        const currentGPA = parseFloat(cumulativeGPA);
        const completedCredits = parseInt(totalCreditsUsed);
        const targetGPA = parseFloat(desiredGrade);
        const futureCreditsValue = parseInt(futureCredits);
    
        if (!isNaN(currentGPA) && !isNaN(completedCredits) && 
            !isNaN(targetGPA) && !isNaN(futureCreditsValue) && 
            futureCreditsValue > 0) {
            
            const totalPoints = currentGPA * completedCredits;
            const targetTotalPoints = targetGPA * (completedCredits + futureCreditsValue);
            const neededPoints = targetTotalPoints - totalPoints;
            const requiredGPA = neededPoints / futureCreditsValue;
    
            if (requiredGPA > 4.0) {
                setResult(`ไม่สามารถทำได้ เนื่องจากต้องได้เกรด ${requiredGPA.toFixed(2)} ซึ่งเกินกว่า 4.00`);
            } else if (requiredGPA < 0) {
                setResult('ไม่สามารถคำนวณได้ เนื่องจากเกรดที่ต้องการต่ำกว่าเกรดปัจจุบัน');
            } else {
                setResult(`เกรดที่คุณต้องทำใน ${futureCreditsValue} หน่วยกิต คือ ${requiredGPA.toFixed(2)}`);
            }
            setError('');
        } else {
            setError('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
            setResult('');
        }
    };    

    // แสดงเกรดโดยตรวจสอบค่าก่อน
    const displayGPA = () => {
        if (cumulativeGPA === null || isNaN(cumulativeGPA)) {
            return 'x.xx';
        }
        return Number(cumulativeGPA).toFixed(2);
    };

    return (
        <div className="container">
            <Sidebar />
            <div className="content">
                <Navbar />
                <div className="grade-info">
                    <h2>
                        เกรดของคุณคือ {displayGPA()}
                    </h2>
                </div>
                <div className="form-group">
                    <label>ป้อนเกรดที่คุณต้องการ</label>
                    <input
                        type="text"
                        placeholder="x.xx"
                        value={desiredGrade}
                        onChange={(e) => setDesiredGrade(e.target.value)}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label>ป้อนหน่วยกิตที่คุณต้องการ</label>
                    <input
                        type="number"
                        placeholder="xx"
                        value={futureCredits}
                        onChange={(e) => setFutureCredits(e.target.value)}
                        className="input-field"
                    />
                </div>
                <button onClick={handleCalculate} className="calculate-button" disabled={loading}>
                    {loading ? 'กำลังคำนวณ...' : 'คำนวณ'}
                </button>
                {error && <div className="error-message">{error}</div>}
                {result && <div className="result"><p>{result}</p></div>}
            </div>
        </div>
    );
};

export default CalGrade;