import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Checkbox,
  Button,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useSearchParams } from 'react-router-dom';

function getWeekDates(baseDate) {
  const date = new Date(baseDate);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(date.setDate(diff + i));
    week.push(new Date(d));
  }
  return week;
}

function AttendanceTracking() {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [baseDate, setBaseDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [searchParams] = useSearchParams();
  const focusedStudentId = searchParams.get('studentId');
  const rowRefs = React.useRef({});

  // Calculate week dates
  const weekDates = getWeekDates(baseDate);
  const weekKeys = weekDates.map(d => d.toISOString().split('T')[0]);

  // Only show the selected student if focusedStudentId is present
  const displayedStudents = focusedStudentId
    ? students.filter(s => s.id === focusedStudentId)
    : students;

  useEffect(() => {
    const loadedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(loadedStudents);
    // Load attendance for the week
    const allAttendance = JSON.parse(localStorage.getItem('attendance')) || {};
    const weekAttendance = {};
    weekKeys.forEach(dateKey => {
      weekAttendance[dateKey] = allAttendance[dateKey] || {};
    });
    setAttendance(weekAttendance);
  }, [baseDate]);

  useEffect(() => {
    if (focusedStudentId && rowRefs.current[focusedStudentId]) {
      rowRefs.current[focusedStudentId].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [focusedStudentId, students]);

  const handleAttendanceChange = (studentId, dateKey) => {
    setAttendance(prev => ({
      ...prev,
      [dateKey]: {
        ...prev[dateKey],
        [studentId]: !prev[dateKey]?.[studentId],
      },
    }));
  };

  const handleSave = () => {
    const allAttendance = JSON.parse(localStorage.getItem('attendance')) || {};
    weekKeys.forEach(dateKey => {
      allAttendance[dateKey] = attendance[dateKey] || {};
    });
    localStorage.setItem('attendance', JSON.stringify(allAttendance));
  };

  // Navigation
  const goToPrevWeek = () => {
    const d = new Date(weekDates[0]);
    d.setDate(d.getDate() - 7);
    setBaseDate(d.toISOString().split('T')[0]);
  };
  const goToNextWeek = () => {
    const d = new Date(weekDates[0]);
    d.setDate(d.getDate() + 7);
    setBaseDate(d.toISOString().split('T')[0]);
  };

  // Attendance summary for each student for the week
  const getWeeklyStats = (studentId) => {
    let present = 0;
    let total = weekKeys.length;
    weekKeys.forEach(dateKey => {
      if (attendance[dateKey]?.[studentId]) present++;
    });
    const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
    return { present, total, percent };
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 4,
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 56, height: 56 }}>
              <EventIcon sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" component="h1" gutterBottom sx={{ ml: 2 }}>
              Attendance Tracking
            </Typography>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2, background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)' }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
            <IconButton onClick={goToPrevWeek} color="primary">
              <ArrowBackIosNewIcon />
            </IconButton>
            <Typography variant="h6">
              Week of {weekDates[0].toLocaleDateString()} - {weekDates[6].toLocaleDateString()}
            </Typography>
            <IconButton onClick={goToNextWeek} color="primary">
              <ArrowForwardIosIcon />
            </IconButton>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              sx={{ ml: 2 }}
            >
              Save Attendance
            </Button>
          </Stack>
        </Paper>

        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Student</TableCell>
                {weekDates.map((date, idx) => (
                  <TableCell key={idx} align="center">
                    {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </TableCell>
                ))}
                <TableCell align="center">Weekly %</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedStudents.map((student) => {
                const stats = getWeeklyStats(student.id);
                return (
                  <TableRow
                    key={student.id}
                    ref={el => rowRefs.current[student.id] = el}
                    sx={focusedStudentId === student.id ? { backgroundColor: '#fffde7' } : {}}
                  >
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>{student.name.charAt(0)}</Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>{student.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{student.studentId}</Typography>
                        </Box>
                      </Stack>
                    </TableCell>
                    {weekKeys.map((dateKey, idx) => (
                      <TableCell key={idx} align="center">
                        <Checkbox
                          checked={!!attendance[dateKey]?.[student.id]}
                          onChange={() => handleAttendanceChange(student.id, dateKey)}
                          color="success"
                        />
                      </TableCell>
                    ))}
                    <TableCell align="center">
                      <Typography variant="body2" fontWeight={600} color="primary">
                        {stats.percent !== 'N/A' ? `${stats.percent}%` : 'N/A'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="h6">
            Total Students: <b>{students.length}</b>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}

export default AttendanceTracking; 