import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userRole = localStorage.getItem('userRole');

  if (!isLoggedIn || userRole !== 'teacher') {
    // Redirect to login if not authenticated or not a teacher
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute; 