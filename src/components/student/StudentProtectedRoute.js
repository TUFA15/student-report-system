import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function StudentProtectedRoute({ children }) {
  const isStudentLoggedIn = localStorage.getItem('isStudentLoggedIn') === 'true';
  const studentRole = localStorage.getItem('studentRole');
  const location = useLocation();

  if (!isStudentLoggedIn || studentRole !== 'student') {
    // Redirect to student login if not authenticated or not a student
    return <Navigate to="/student/login" replace />;
  }

  // If trying to access /student/dashboard directly, redirect to welcome
  if (location.pathname === '/student/dashboard') {
    return <Navigate to="/student/welcome" replace />;
  }

  return children;
}

export default StudentProtectedRoute; 