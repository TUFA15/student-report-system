import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentLogout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('studentRole');
    localStorage.removeItem('currentStudent');
    navigate('/student/login');
  }, [navigate]);

  return null;
}

export default StudentLogout; 