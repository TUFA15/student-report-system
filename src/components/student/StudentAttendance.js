import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import { Container, Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function StudentAttendance() {
  const [attendanceRows, setAttendanceRows] = useState([]);
  const student = JSON.parse(localStorage.getItem('currentStudent')) || {};

  useEffect(() => {
    const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
    const rows = [];
    Object.entries(attendanceData).forEach(([date, dayObj]) => {
      if (student.id in dayObj) {
        rows.push({ date, present: !!dayObj[student.id] });
      }
    });
    // Sort by date descending
    rows.sort((a, b) => new Date(b.date) - new Date(a.date));
    setAttendanceRows(rows);
  }, [student.id]);

  return (
    <>
      <StudentNavbar />
      <Container maxWidth="sm">
        <Box sx={{ mt: 6, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white', mb: 4, textAlign: 'center' }}>
            <Avatar sx={{ bgcolor: 'white', color: 'primary.main', width: 64, height: 64, mx: 'auto', mb: 2 }}>
              <EventAvailableIcon fontSize="large" />
            </Avatar>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Attendance Register
            </Typography>
            <Typography variant="body1">{student.name} ({student.studentId})</Typography>
          </Paper>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" gutterBottom>Daily Attendance</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="center">Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {attendanceRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={2} align="center">No attendance records found.</TableCell>
                    </TableRow>
                  ) : (
                    attendanceRows.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                        <TableCell align="center" style={{ color: row.present ? 'green' : 'red', fontWeight: 600 }}>
                          {row.present ? 'Present' : 'Absent'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Container>
    </>
  );
}

export default StudentAttendance; 