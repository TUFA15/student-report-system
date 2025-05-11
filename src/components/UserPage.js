import React, { useEffect, useState, useRef } from 'react';
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
  IconButton,
  Tooltip,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import GradeIcon from '@mui/icons-material/Grade';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import CameraAltIcon from '@mui/icons-material/CameraAlt';

function UserPage() {
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'User', email: 'user@example.com' };
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [profilePic, setProfilePic] = useState(localStorage.getItem('profilePic') || '');
  const fileInputRef = useRef();

  useEffect(() => {
    setStudents(JSON.parse(localStorage.getItem('students')) || []);
    setAttendanceData(JSON.parse(localStorage.getItem('attendance')) || {});
  }, []);

  // Calculate stats
  const totalStudents = students.length;
  const totalGrades = students.reduce((acc, s) => acc + (s.grades ? s.grades.length : 0), 0);
  const attendanceDays = Object.keys(attendanceData).length;

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePic(event.target.result);
        localStorage.setItem('profilePic', event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 6, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white', mb: 4 }}>
          <Stack spacing={2} alignItems="center">
            <Box sx={{ position: 'relative', width: 80, height: 80 }}>
              <Tooltip title="Edit Profile Picture">
                <IconButton
                  sx={{ position: 'absolute', bottom: 0, right: 0, zIndex: 2, bgcolor: 'white', p: 0.5 }}
                  onClick={handleAvatarClick}
                >
                  <CameraAltIcon color="primary" />
                </IconButton>
              </Tooltip>
              <Avatar
                src={profilePic}
                sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', fontSize: 48, cursor: 'pointer', border: '2px solid #1976d2' }}
                onClick={handleAvatarClick}
              >
                {!profilePic && <PersonIcon fontSize="inherit" />}
              </Avatar>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </Box>
            <Typography variant="h4" fontWeight={700}>{currentUser.name}</Typography>
            <Typography variant="body1">{currentUser.email}</Typography>
          </Stack>
        </Paper>
        <Grid container spacing={3}>
          {students.length === 0 ? (
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, textAlign: 'center', p: 3 }}>
                <Typography variant="h6">No students found.</Typography>
              </Card>
            </Grid>
          ) : (
            students.map((student) => {
              // Calculate average grade
              const avgGrade = student.grades && student.grades.length > 0
                ? (student.grades.reduce((acc, g) => acc + g.grade, 0) / student.grades.length).toFixed(2)
                : 'N/A';
              // Calculate attendance percentage
              const attendanceData = JSON.parse(localStorage.getItem('attendance')) || {};
              let present = 0, total = 0;
              Object.values(attendanceData).forEach(day => {
                if (student.id in day) {
                  total++;
                  if (day[student.id]) present++;
                }
              });
              const attendancePercent = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
              return (
                <Grid item xs={12} sm={6} key={student.id}>
                  <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e3f2fd 30%, #ffffff 90%)', p: 2 }}>
                    <CardContent>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                          {student.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="h6">{student.name}</Typography>
                          <Typography variant="body2" color="text.secondary">ID: {student.studentId}</Typography>
                          <Typography variant="body2" color="text.secondary">Avg. Grade: {avgGrade}</Typography>
                          <Typography variant="body2" color="text.secondary">Attendance: {attendancePercent}%</Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })
          )}
        </Grid>
      </Box>
    </Container>
  );
}

export default UserPage; 