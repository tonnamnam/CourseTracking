const express = require('express');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const cors = require('cors'); // นำเข้า cors

dotenv.config();

const app = express();
app.use(cors()); // เปิดใช้งาน CORS
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
    const user = await pool.query('SELECT * FROM public."Student" WHERE "Email" = $1 AND "Password" = $2;', [email, password]);
    
    if (user.rows.length === 0) {
      return res.status(401).json({ error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' });
    }

    res.status(200).json({ message: 'ล็อกอินสำเร็จ' });
  } catch (error) {
    console.error(error); // แสดงข้อผิดพลาดใน console
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในเซิร์ฟเวอร์' });
  }
});

// เริ่มต้นเซิร์ฟเวอร์
const PORT = process.env.PORT || 5000; // ใช้พอร์ตที่กำหนดใน .env หรือ 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});