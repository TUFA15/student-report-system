import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Avatar,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AssessmentIcon from '@mui/icons-material/Assessment';
import TimelineIcon from '@mui/icons-material/Timeline';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [attendancePercent, setAttendancePercent] = useState('N/A');
  const [avgGrade, setAvgGrade] = useState('N/A');
  const [subjectGrades, setSubjectGrades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('currentStudent'));
    if (!s) {
      navigate('/student-login');
      return;
    }
    setStudent(s);
    // Calculate average grade
    if (s.grades && s.grades.length > 0) {
      setAvgGrade((s.grades.reduce((acc, g) => acc + g.grade, 0) / s.grades.length).toFixed(2));
      // Subject-wise grades
      const bySubject = {};
      s.grades.forEach(g => {
        if (!bySubject[g.subject]) bySubject[g.subject] = [];
        bySubject[g.subject].push(g.grade);
      });
      setSubjectGrades(Object.entries(bySubject).map(([subject, grades]) => ({
        subject,
        avg: (grades.reduce((a, b) => a + b, 0) / grades.length).toFixed(2),
      })));
    }
    // Attendance
    const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
    let present = 0, total = 0;
    Object.values(attendanceData).forEach(day => {
      if (s.id in day) {
        total++;
        if (day[s.id]) present++;
      }
    });
    setAttendancePercent(total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A');
  }, [navigate]);

  if (!student) return null;

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white', mb: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', fontSize: 48 }}>
              <PersonIcon fontSize="inherit" />
            </Avatar>
            <Typography variant="h4" fontWeight={700}>{student.name}</Typography>
            <Typography variant="body1">ID: {student.studentId}</Typography>
          </Stack>
        </Paper>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                  <GradeIcon />
                </Avatar>
                <Typography variant="h6">Average Grade</Typography>
                <Typography variant="h4" color="primary" fontWeight={700}>{avgGrade}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                  <EventAvailableIcon />
                </Avatar>
                <Typography variant="h6">Attendance</Typography>
                <Typography variant="h4" color="info.main" fontWeight={700}>{attendancePercent}%</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: 'center' }}>
              <CardContent>
                <Avatar sx={{ bgcolor: 'success.main', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                  <AssessmentIcon />
                </Avatar>
                <Typography variant="h6">Progress Report</Typography>
                <Button variant="contained" color="primary" fullWidth sx={{ mt: 1 }} onClick={() => navigate('/student-progress-report')}>
                  View Report
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>Subject-wise Grades</Typography>
          <Grid container spacing={2}>
            {subjectGrades.map(sg => (
              <Grid item xs={12} sm={6} md={4} key={sg.subject}>
                <Card sx={{ borderRadius: 2, boxShadow: 2, textAlign: 'center' }}>
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600}>{sg.subject}</Typography>
                    <Typography variant="h5" color="primary">{sg.avg}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button variant="outlined" startIcon={<TimelineIcon />} onClick={() => navigate('/student-performance-charts')}>
            Performance Charts
          </Button>
          <Button variant="outlined" startIcon={<CalendarMonthIcon />} onClick={() => navigate('/student-attendance-history')}>
            Attendance History
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default StudentDashboard; 