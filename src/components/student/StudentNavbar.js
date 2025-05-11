import React from 'react';
import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

function StudentNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <AppBar position="static" color="primary" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            color={location.pathname === '/student/dashboard' ? 'secondary' : 'inherit'}
            onClick={() => navigate('/student/dashboard')}
            sx={{ fontWeight: 600, mr: 2 }}
          >
            Dashboard
          </Button>
          <Button
            color={location.pathname === '/student/progress' ? 'secondary' : 'inherit'}
            onClick={() => navigate('/student/progress')}
            sx={{ fontWeight: 600, mr: 2 }}
          >
            Progress
          </Button>
          <Button
            color={location.pathname === '/student/attendance' ? 'secondary' : 'inherit'}
            onClick={() => navigate('/student/attendance')}
            sx={{ fontWeight: 600 }}
          >
            Attendance
          </Button>
        </Box>
        <Button
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={() => navigate('/student/logout')}
          sx={{ fontWeight: 600 }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default StudentNavbar; 