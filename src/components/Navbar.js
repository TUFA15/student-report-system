import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Grade as GradeIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PersonIcon from '@mui/icons-material/Person';

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Student Report System
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/students"
            startIcon={<PeopleIcon />}
          >
            Students
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/add-grade"
            startIcon={<GradeIcon />}
          >
            Add Grade
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/progress"
            startIcon={<AssessmentIcon />}
          >
            Progress Analysis
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/attendance"
            startIcon={<AssignmentTurnedInIcon />}
          >
            Attendance
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/user"
            startIcon={<PersonIcon />}
          >
            Profile
          </Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar; 