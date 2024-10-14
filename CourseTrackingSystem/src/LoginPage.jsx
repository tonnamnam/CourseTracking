import React from 'react';
import { Box, TextField, Button, Typography, Container } from '@mui/material';
import { styled, GlobalStyles } from '@mui/system';
import logo from './assets/KMITL_LOGO.png';

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
  return (
    <>
      <GlobalStyles
        styles={{
          body: { backgroundColor: '#FF6600', margin: 0, padding: 0 }, // ตั้ง background color ของ body เฉพาะหน้า LoginPage
        }}
      />
      <Box
        sx={{
          backgroundColor: '#FF6600',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="xs">
          <Box
            sx={{
              backgroundColor: 'white',
              padding: 4,
              borderRadius: 2,
              boxShadow: 3,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
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
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
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
