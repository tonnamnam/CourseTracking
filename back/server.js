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

app.get('/api/schedule/:studentId', async (req, res) => {
  const { studentId } = req.params;
  try {
    const result = await pool.query(`
      SELECT DISTINCT 
    sm.semesterid,
    cr.courseid,
    cr.coursename,
    cr.courseformat,
    cr.coursetimes->>'day' AS day,
    cr.coursetimes->>'start' AS startTime,
    cr.coursetimes->>'end' AS endTime
FROM semester sm
JOIN enrollment en ON en.semesterid = sm.semesterid
JOIN course cr ON cr.courseid = en.courseid AND en.section = cr.section aND cr.semester = en.semesterid
WHERE en.studentid = $1
ORDER BY sm.semesterid;
    `,[studentId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลตารางเรียน' });
    }

    res.status(200).json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching student courses:', error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลตารางเรียน' });
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
    SELECT (COALESCE(mj.completedcredits, 0) + COALESCE(g.completedcredits, 0)) AS completedcredits
    FROM student st
    INNER JOIN majorrequirement mj ON mj.studentid = st.studentid
    INNER JOIN gened g ON g.studentid = st.studentid
    WHERE st.studentid = $1
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

// Endpoint สำหรับดึงข้อมูลหน่วยกิต GenEd, major
app.get('/api/gened-major', async (req, res) => {
  const { studentid } = req.query;
  try {
    const result = await pool.query(`
      SELECT 
        g.requiredcredits AS genedtotalcredit,
        g.completedcredits AS genedcompletedcredit,
        g.remainingcredits AS genedremainingcredit,
        mj.requiredcredits AS majortotalcredit,
        mj.completedcredits AS majorcompletedcredit,
        mj.remainingcredits AS majorremainingcredit
      FROM gened g
      INNER JOIN majorrequirement mj ON g.studentid = mj.studentid
      WHERE g.studentid = $1
    `, [studentid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูล' });
    }

    res.status(200).json({
      gened: {
        totalCredits: result.rows[0].genedtotalcredit,
        completedCredits: result.rows[0].genedcompletedcredit,
        remainingCredits: result.rows[0].genedremainingcredit
      },
      major: {
        totalCredits: result.rows[0].majortotalcredit,
        completedCredits: result.rows[0].majorcompletedcredit,
        remainingCredits: result.rows[0].majorremainingcredit
      }
    });
  } catch (error) {
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
app.get('/api/grade', async (req, res) => {
  const { studentid } = req.query;
  try {
    const result = await pool.query(`
      SELECT 
          studentid,
          year,
          semesterid,
          ROUND(SUM(gradepoint * credits) / NULLIF(SUM(credits), 0), 2) AS gps,
          SUM(credits) AS total_credits
      FROM (
          SELECT DISTINCT
              en.studentid,
              sm.year,
              sm.semesterid,
              en.courseid,
              cr.coursename,
              en.grade,
              gr.gradepoint,
              cr.credits
          FROM enrollment en
          INNER JOIN course cr ON en.courseid = cr.courseid
          INNER JOIN semester sm ON sm.semesterid = en.semesterid
          INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
          WHERE en.studentid = $1
              AND en.grade IS NOT NULL
              AND en.grade NOT IN ('S', 'U')
      ) AS FilteredCourses
      GROUP BY studentid, year, semesterid
      ORDER BY year, semesterid;
    `, [studentid]);

    if (result.rows.length === 0) {
      return res.status(200).json({ semesters: [], selectedGPS: null, cumulativeGPA: null });
    }

    const cumulativeResult = await pool.query(`
      SELECT 
    studentid,
    ROUND(SUM(gradepoint * credits) / NULLIF(SUM(credits), 0), 2) AS cumulative_gpa,  -- คำนวณ GPA รวม
    SUM(credits) AS total_credits_used  -- รวมเครดิตทั้งหมดที่ใช้
FROM (
    SELECT DISTINCT
        en.studentid,
        en.courseid,
        gr.gradepoint,
		cr.credits
    FROM enrollment en
    INNER JOIN course cr ON en.courseid = cr.courseid
    INNER JOIN grade gr ON TRIM(en.grade) = gr.gradeletter
    WHERE en.studentid = $1
        AND en.grade IS NOT NULL
        AND en.grade NOT IN ('S', 'U')
) AS FilteredCourses
GROUP BY studentid
ORDER BY studentid;
    `, [studentid]);

    const cumulativeGPA = cumulativeResult.rows[0]?.cumulative_gpa || null;
    const totalCreditsUsed = cumulativeResult.rows[0]?.total_credits_used || 0;

    res.status(200).json({
      semesters: result.rows,
      selectedGPS: result.rows.length > 0 ? result.rows[result.rows.length - 1] : null,
      cumulativeGPA: cumulativeGPA,
      totalCreditsUsed: totalCreditsUsed
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูล GPS' });
  }
});

// Endpoint สำหรับดึงข้อมูล notifications
app.get('/api/notifications', async (req, res) => {
  const { studentid } = req.query;
  try {
    const query = `
      SELECT notificationid, detail, startdate, enddate, studentid
      FROM public.notification
      WHERE 
          (
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
          )
          AND (studentid IS NULL OR studentid = $1)
      ORDER BY startdate;
    `;

    const result = await pool.query(query, [studentid]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 1. วิชาเลือกภาคที่ยังไม่เรียน
app.get("/api/uncompleted-major-elective/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits
          FROM course cr
          WHERE cr.courseid NOT IN (
              SELECT en.courseid FROM enrollment en WHERE en.studentid = $1
          )
          AND cr.courseid like '0550____' AND cr.requirementtype = 'elective'
          ORDER BY cr.courseid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

// 2. วิชาเลือกภาคที่เรียนไปแล้ว
app.get("/api/completed-major-elective/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits, en.grade , en.semesterid , sm.year , sm.semesterid
          FROM enrollment en
          JOIN course cr ON cr.courseid = en.courseid
          JOIN semester sm on sm.semesterid = en.semesterid
          WHERE en.studentid = $1 AND cr.courseid LIKE '0550____' AND cr.requirementtype = 'elective'
          ORDER BY sm.year , sm.semesterid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

// 3. วิชาบังคับภาคที่เรียนไปแล้ว
app.get("/api/completed-major-required/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits, en.grade , sm.year , sm.semesterid
          FROM enrollment en
          JOIN course cr ON cr.courseid = en.courseid
		      JOIN semester sm on sm.semesterid = en.semesterid
          WHERE en.studentid = $1 AND cr.courseid LIKE '0550____' AND cr.requirementtype = 'required'
		      ORDER BY sm.year , sm.semesterid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

// 4. วิชาบังคับภาคที่ยังไม่เรียน
app.get("/api/uncompleted-major-required/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits
          FROM course cr
          WHERE cr.courseid NOT IN (
              SELECT en.courseid FROM enrollment en WHERE en.studentid = $1
          )
          AND cr.courseid LIKE '0550____' AND cr.requirementtype = 'required'
          ORDER BY cr.courseid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

// 5. วิชา Gened ที่ยังไม่ได้เรียน
app.get("/api/uncompleted-gened/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits
          FROM course cr
          WHERE cr.courseid NOT IN (
              SELECT en.courseid FROM enrollment en WHERE en.studentid = $1
          )
          AND cr.courseid LIKE '90______'
          ORDER BY cr.courseid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

// 6. วิชา Gened ที่เรียนไปแล้ว
app.get("/api/completed-gened/:studentid", async (req, res) => {
  try {
      const { studentid } = req.params;
      const result = await pool.query(`
          SELECT DISTINCT cr.courseid, cr.coursename, cr.credits, en.grade , sm.year , sm.semesterid
          FROM enrollment en
          JOIN course cr ON cr.courseid = en.courseid
          JOIN semester sm on sm.semesterid = en.semesterid
          WHERE en.studentid = $1 AND cr.courseid LIKE '90______'
          ORDER BY sm.year , sm.semesterid
      `, [studentid]);
      res.json(result.rows);
  } catch (err) {
      console.error(err.message);
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});