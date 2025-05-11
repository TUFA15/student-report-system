import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, Grid, Button, Avatar, Stack } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BarChartIcon from '@mui/icons-material/BarChart';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';

function StudentWelcome() {
  const navigate = useNavigate();
  const student = JSON.parse(localStorage.getItem('currentStudent')) || {};

  return (
    <Box sx={{ mt: 6, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 5, borderRadius: 4, minWidth: 400, textAlign: 'center', background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white' }}>
        <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: 'primary.main', mx: 'auto', mb: 2 }}>
          {student.name ? student.name.charAt(0).toUpperCase() : '?'}
        </Avatar>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Welcome, {student.name || 'Student'}!
        </Typography>
        <Typography variant="body1" sx={{ mb: 4 }}>
          ID: {student.studentId}
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ py: 2, borderRadius: 3, fontWeight: 600, fontSize: 18 }}
              startIcon={<DashboardIcon />}
              onClick={() => navigate('/student/dashboard')}
            >
              Dashboard
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="success"
              sx={{ py: 2, borderRadius: 3, fontWeight: 600, fontSize: 18 }}
              startIcon={<BarChartIcon />}
              onClick={() => navigate(`/student/progress`)}
            >
              Progress
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="contained"
              color="info"
              sx={{ py: 2, borderRadius: 3, fontWeight: 600, fontSize: 18 }}
              startIcon={<EventAvailableIcon />}
              onClick={() => navigate('/student/attendance')}
            >
              Attendance
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default StudentWelcome; 