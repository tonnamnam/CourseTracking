import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Typography, Container, Divider } from '@mui/material';
import { styled, GlobalStyles } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KMITL_LOGO.png';
import "../styles/LoginPage.css";

// ต้องติดตั้ง @react-oauth/google ก่อน: npm install @react-oauth/google
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

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
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // ตั้งค่า Google Client ID
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogin = () => {
    // เพิ่มลอจิกการตรวจสอบอีเมลและรหัสผ่านที่นี่
    // if (email && password) {
      // ตรวจสอบกับ backend API
      navigate('/home');
    // } else {
    //   setError('กรุณากรอกอีเมลและรหัสผ่าน');
    // }
  };

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    const email = decoded.email;
    
    if (email.endsWith('@kmitl.ac.th')) {
      // ดำเนินการล็อกอินสำเร็จ
      console.log('Logged in with Google:', email);
      navigate('/home');
    } else {
      setError('กรุณาใช้อีเมล @kmitl.ac.th เท่านั้น');
    }
  };

  const handleGoogleFailure = () => {
    setError('การล็อกอินด้วย Google ไม่สำเร็จ กรุณาลองอีกครั้ง');
  };

  return (
    <>
      <GlobalStyles
        styles={{
          body: { backgroundColor: '#FF6600', margin: 0, padding: 0 },
        }}
      />
      <Box className="login-container">
        <Container maxWidth="xs">
          <Box className="login-box">
            <Logo src={logo} alt="KMITL Logo" />
            <Typography variant="h5" component="h1" gutterBottom>
              SIGN IN
            </Typography>
            {error && (
              <Typography color="error" align="center" gutterBottom>
                {error}
              </Typography>
            )}
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <OrangeButton
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              LOGIN
            </OrangeButton>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                // ต้องใส่ Client ID ที่ได้จาก Google Developer Console
                clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
              />
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;