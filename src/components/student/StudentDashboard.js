import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

function StudentDashboard() {
  const navigate = useNavigate();
  const currentStudent = JSON.parse(localStorage.getItem('currentStudent')) || {};
  const [photo, setPhoto] = useState(currentStudent.photo || null);
  const fileInputRef = useRef();

  // Migration: ensure every student has an id
  useEffect(() => {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    let changed = false;
    students = students.map(s => {
      if (!s.id) { changed = true; return { ...s, id: s.studentId }; }
      return s;
    });
    if (changed) localStorage.setItem('students', JSON.stringify(students));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isStudentLoggedIn');
    localStorage.removeItem('studentRole');
    localStorage.removeItem('currentStudent');
    navigate('/student/login');
  };

  // Calculate average grade
  const avgGrade = currentStudent.grades && currentStudent.grades.length > 0
    ? (currentStudent.grades.reduce((acc, g) => acc + g.grade, 0) / currentStudent.grades.length).toFixed(2)
    : 'N/A';

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
        // Save to localStorage for current student
        let students = JSON.parse(localStorage.getItem('students')) || [];
        students = students.map(s =>
          s.id === currentStudent.id ? { ...s, photo: reader.result } : s
        );
        localStorage.setItem('students', JSON.stringify(students));
        // Also update currentStudent in localStorage
        const updatedStudent = { ...currentStudent, photo: reader.result };
        localStorage.setItem('currentStudent', JSON.stringify(updatedStudent));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 4 }}>
        {/* Gradient Header */}
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white', mb: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <Button variant="contained" color="secondary" onClick={() => navigate('/student/welcome')}>
                Welcome
              </Button>
              <Button variant="contained" color="success" onClick={() => navigate('/student/progress')}>
                Progress
              </Button>
              <Button variant="contained" color="info" onClick={() => navigate('/student/attendance')}>
                Attendance
              </Button>
            </Box>
            <Avatar
              sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', fontSize: 48, cursor: 'pointer' }}
              onClick={handleAvatarClick}
              src={photo || undefined}
            >
              {!photo && <PersonIcon fontSize="inherit" />}
            </Avatar>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handlePhotoChange}
            />
            <Typography variant="caption" color="white" sx={{ mt: 1, cursor: 'pointer' }} onClick={handleAvatarClick}>
              Change Profile Photo
            </Typography>
            <Typography variant="h4" fontWeight={700}>{currentStudent.name}</Typography>
            <Typography variant="body1">ID: {currentStudent.studentId}</Typography>
            <Button variant="contained" color="secondary" onClick={() => navigate('/student/logout')} sx={{ mt: 2 }}>
              Logout
            </Button>
          </Stack>
        </Paper>
        {/* Removed Class, Grade, Average Grade, Attendance, and Recent Grades cards/sections */}
      </Box>
    </Container>
  );
}

export default StudentDashboard; 