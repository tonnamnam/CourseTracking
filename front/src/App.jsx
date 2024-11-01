import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginPage from './pages/LoginPage.jsx';
import HomePage from './pages/Homepage.jsx';
import Schedule from './pages/Schedule.jsx';
import CalGrade from './pages/CalGrade.jsx';
import GradeCalculator from './pages/GradeCalculator.jsx';

function App() {
  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/calgrade" element={<CalGrade />} />
          <Route path="/gradeCalculator" element={<GradeCalculator />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;