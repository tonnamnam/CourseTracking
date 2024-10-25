const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Endpoint สำหรับล็อกอิน
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT StudentID, Email FROM public.student WHERE Email = $1 AND Password = $2;', [email, password]);

    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    res.status(200).json({
      message: 'ล็อกอินสำเร็จ',
      email: user.rows[0].email,
      studentid: user.rows[0].studentid
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

// Endpoint สำหรับดึงข้อมูลหน่วยกิตที่ต้องเรียน (แก้ไขให้ใช้ StudentID)
app.get('/api/major-requirements', async (req, res) => {
  const { studentid } = req.query;
  try {
    const result = await pool.query(`
      WITH requiredcredits AS (
    SELECT dp.totalcredits AS requiredcredits
    FROM majorrequirement mj
    JOIN department dp ON dp.departmentid = mj.departmentid
    WHERE mj.studentid = $1
),
completedcredits AS (
    SELECT SUM(cr.credits) AS completedcredits
    FROM student st
    INNER JOIN enrollment en ON en.studentid = st.studentid
    INNER JOIN course cr ON cr.courseid = en.courseid
    WHERE st.studentid = $1 and en.grade is not null
)
SELECT rc.requiredcredits, cc.completedcredits, 
       (rc.requiredcredits - cc.completedcredits) AS remainingcredits
FROM requiredcredits rc, completedcredits cc;
`, [studentid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    }

    res.status(200).json({
      requiredCredits: result.rows[0].requiredcredits,
      completedCredits: result.rows[0].completedcredits,
      remainingCredits: result.rows[0].remainingcredits
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// Endpoint สำหรับดึงข้อมูลนักเรียน
app.get('/api/student-details', async (req, res) => {
  const { studentid } = req.query;
  try {
    const result = await pool.query(`
      SELECT Name, Surname 
      FROM public.student 
      WHERE StudentID = $1
    `, [studentid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลนักเรียน' });
    }

    res.status(200).json({
      name: result.rows[0].name,
      surname: result.rows[0].surname
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
  }
});

// Endpoint สำหรับดึงข้อมูล GPS และ GPA รวม
// แก้ไข endpoint สำหรับดึงข้อมูล GPS และ GPA รวม
// Endpoint สำหรับดึงข้อมูล GPS และ GPA รวม
app.get('/api/grade', async (req, res) => {
  const { studentid } = req.query;
  try {
    // ดึง GPS ของแต่ละเทอม (กรองเกรด S และ U ออก)
    const result = await pool.query(`
      SELECT 
        en.studentid,
        sm.semestername,
        ROUND(SUM(gr.gradepoint * cr.credits) / NULLIF(SUM(cr.credits), 0), 2) as gps,
        sm.semesterid
      FROM enrollment en
      INNER JOIN course cr ON en.courseid = cr.courseid
      INNER JOIN semester sm ON sm.semesterid = en.semesterid
      INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
      WHERE en.studentid = $1 AND en.grade IS NOT NULL AND en.grade NOT IN ('S', 'U')
      GROUP BY en.studentid, sm.semestername, sm.semesterid
      ORDER BY sm.semesterid;
    `, [studentid]);

    if (result.rows.length === 0) {
      return res.status(200).json({ semesters: [], selectedGPS: null, cumulativeGPA: null });
    }

    const cumulativeResult = await pool.query(`
      SELECT 
        ROUND(CAST(SUM(gr.gradepoint * cr.credits) / NULLIF(SUM(cr.credits), 0) AS NUMERIC), 2) as cumulative_gpa,
        SUM(cr.credits) AS total_credits_used
      FROM enrollment en
      INNER JOIN course cr ON en.courseid = cr.courseid
      INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
      WHERE en.studentid = $1 AND en.grade IS NOT NULL AND en.grade NOT IN ('S', 'U')
    `, [studentid]);

    // เก็บ cumulative GPA และ total credits ไว้ในตัวแปรเพื่อใช้งานต่อ
    const cumulativeGPA = cumulativeResult.rows[0]?.cumulative_gpa || null;
    const totalCreditsUsed = cumulativeResult.rows[0]?.total_credits_used || 0;

    res.status(200).json({
      semesters: result.rows,
      selectedGPS: result.rows[result.rows.length - 1],  // เลือกเทอมล่าสุด
      cumulativeGPA: cumulativeGPA,
      totalCreditsUsed: totalCreditsUsed // เพิ่ม total credits used เข้าไปใน response
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล GPS' });
  }
});

app.get('/api/notifications', async (req, res) => {
  try {
    const query = `
      SELECT notificationid, detail, startdate, enddate
      FROM public.notification
      WHERE 
        (
          enddate IS NULL AND 
          CURRENT_DATE >= (startdate - INTERVAL '14 days') AND
          CURRENT_DATE < (startdate + INTERVAL '1 day')
        )
        OR
        (
          enddate IS NOT NULL AND 
          CURRENT_DATE >= (startdate - INTERVAL '14 days') AND
          CURRENT_DATE < (enddate + INTERVAL '1 day')
        )
      ORDER BY startdate;
    `;
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});