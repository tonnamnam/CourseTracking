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
app.post('/', async (req, res) => {
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
      SELECT 
        dp.totalcredits AS requiredcredits, 
        (mj.completedcredits + ged.completedcredits) AS completedcredits,
        (dp.totalcredits - (mj.completedcredits + ged.completedcredits)) AS remainingcredits
      FROM majorrequirement mj 
      JOIN gened ged ON ged.studentid = mj.studentid 
      JOIN department dp ON dp.departmentid = mj.departmentid
      WHERE mj.studentid = $1 AND ged.studentid = $1;`, [studentid]);

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
app.get('/api/grade', async (req, res) => {
  const { studentid } = req.query;
  try {
    const result = await pool.query(
      `
      SELECT 
        en.studentid,
        sm.semestername,
        ROUND(SUM(gr.gradepoint * cr.credits) / SUM(cr.credits), 2) as gps,
        sm.semesterid
      FROM enrollment en
      INNER JOIN course cr ON en.courseid = cr.courseid
      INNER JOIN semester sm ON sm.semesterid = en.semesterid
      INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
      WHERE en.studentid = $1 
        AND en.grade IS NOT NULL 
        AND en.grade NOT IN ('S', 'U') -- Exclude 'S' and 'U' grades
      GROUP BY en.studentid, sm.semestername, sm.semesterid
      ORDER BY sm.semesterid;
      `,
      [studentid]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({ semesters: [], selectedGPS: null, cumulativeGPA: null });
    }

    const cumulativeResult = await pool.query(
      `
      SELECT 
        en.studentid,
        ROUND(SUM(gr.gradepoint * cr.credits) / SUM(cr.credits), 2) as gpa
      FROM enrollment en
      INNER JOIN course cr ON en.courseid = cr.courseid
      INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
      WHERE en.studentid = $1 
        AND en.grade IS NOT NULL 
        AND en.grade NOT IN ('S', 'U') -- Exclude 'S' and 'U' grades
      GROUP BY en.studentid;
      `,
      [studentid]
    );

    const cumulativeGPA = cumulativeResult.rows[0]?.cumulative_gpa || null;

    res.status(200).json({
      semesters: result.rows,
      selectedGPS: result.rows[result.rows.length - 1],  // เลือกเทอมล่าสุด
      cumulativeGPA: cumulativeGPA
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล GPS' });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});