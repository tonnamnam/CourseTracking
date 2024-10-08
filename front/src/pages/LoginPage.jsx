import React from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { styled, GlobalStyles } from '@mui/system';
import { useNavigate } from 'react-router-dom'; // นำเข้า useNavigate
import logo from '../assets/KMITL_LOGO.png';
import "../styles/LoginPage.css";

const OrangeButton = styled(Button)({
  backgroundColor: '#FF6600',
  color: 'white',
  '&:hover': {
    backgroundColor: '#E65C00',
  },
  fontSize: '24px',
});

const Logo = styled('img')({
  width: '100%',
  maxWidth: '200px',
  marginBottom: '20px',
});

const LoginPage = () => {
  const navigate = useNavigate(); // ใช้ useNavigate สำหรับการนำทาง

  const handleLogin = () => {
    // Logic สำหรับการตรวจสอบข้อมูลผู้ใช้ (เช่น ตรวจสอบอีเมลและรหัสผ่าน)
    // หากตรวจสอบผ่านให้นำทางไปยังหน้า home
    navigate('/home');
  };

  return (
    <>
      <GlobalStyles
        styles={{
          body: { backgroundColor: '#FF6600', margin: 0, padding: 0 }, // ตั้ง background color ของ body เฉพาะหน้า LoginPage
        }}
      />
      <Box
        className="login-container"
      >
        <Container maxWidth="xs">
          <Box className="login-box">
            <Logo src={logo} alt="KMITL Logo" />
            <Typography variant="h5" component="h1" gutterBottom>
              SIGN IN
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <OrangeButton
              type="button" // เปลี่ยนจาก submit เป็น button
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin} // เรียกใช้ handleLogin เมื่อคลิกปุ่ม
            >
              LOGIN
            </OrangeButton>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;