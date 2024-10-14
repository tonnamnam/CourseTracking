import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { styled, GlobalStyles } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/KMITL_LOGO.png';
import "../styles/LoginPage.css";

// ต้องติดตั้ง @react-oauth/google ก่อน: npm install @react-oauth/google
// import { GoogleLogin } from '@react-oauth/google';

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

  const handleLogin = async () => {
    navigate('/home')
    // try {
    //   const response = await fetch('http://localhost:5000/', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ email, password }),
    //   });

    //   const data = await response.json();
    //   if (response.ok) {
    //     navigate('/home');
    //   }
    // } catch (error) {
    //   setError('การล็อกอินล้มเหลว กรุณาลองใหม่อีกครั้ง');
    // }
  };

  // const handleGoogleSuccess = (credentialResponse) => {
  //   const decoded = jwtDecode(credentialResponse.credential);
  //   const email = decoded.email;
  //   
  //   if (email.endsWith('@kmitl.ac.th')) {
  //     // ดำเนินการล็อกอินสำเร็จ
  //     console.log('Logged in with Google:', email);
  //     navigate('/home');
  //   } else {
  //     setError('กรุณาใช้อีเมล @kmitl.ac.th เท่านั้น');
  //   }
  // };

  // const handleGoogleFailure = () => {
  //   setError('การล็อกอินด้วย Google ไม่สำเร็จ กรุณาลองอีกครั้ง');
  // };

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
            {/* ส่วนสำหรับล็อกอินด้วย Google ถูกคอมเมนต์ออก
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleFailure}
                clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com"
              />
            </Box>
            */}
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default LoginPage;