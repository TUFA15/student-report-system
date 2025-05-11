import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  Stack,
  Avatar,
  Divider,
} from '@mui/material';
import {
  School as SchoolIcon,
  People as PeopleIcon,
  Grade as GradeIcon,
  Assessment as AssessmentIcon,
  ArrowForward as ArrowForwardIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
  Help as HelpIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser')) || { name: 'User' };

  const quickActions = [
    {
      title: 'View Students',
      description: 'Access the complete list of students and their information',
      icon: <PeopleIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
      path: '/students',
      color: '#1976d2',
    },
    {
      title: 'Add Grades',
      description: 'Enter and update student grades and performance data',
      icon: <GradeIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
      path: '/add-grade',
      color: '#2e7d32',
    },
    {
      title: 'Progress Analysis',
      description: 'Track and analyze student performance over time',
      icon: <TimelineIcon sx={{ fontSize: 40, color: '#ed6c02' }} />,
      path: '/progress',
      color: '#ed6c02',
    },
    {
      title: 'Attendance',
      description: 'Mark and review daily or weekly attendance records',
      icon: <AssignmentTurnedInIcon sx={{ fontSize: 40, color: '#0288d1' }} />,
      path: '/attendance',
      color: '#0288d1',
    },
  ];

  const gettingStarted = [
    {
      text: 'Navigate to Students section to view all student records',
      icon: <PeopleIcon color="primary" />,
    },
    {
      text: 'Use the Add Grade feature to input new grades',
      icon: <GradeIcon color="primary" />,
    },
    {
      text: 'View individual student reports for detailed performance analysis',
      icon: <AssessmentIcon color="primary" />,
    },
    {
      text: 'Track progress and identify areas for improvement',
      icon: <TimelineIcon color="primary" />,
    },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Welcome Header */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mb: 4, 
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            color: 'white',
            borderRadius: 2,
          }}
        >
          <Grid container alignItems="center" spacing={3}>
            <Grid item>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'white',
                  color: 'primary.main',
                }}
              >
                <SchoolIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Welcome, {currentUser.name}! 👋
              </Typography>
              <Typography variant="body1">
                Get started with the Student Report System. Here's what you can do:
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Quick Actions Section */}
          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 4 }}>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <EmojiEventsIcon color="primary" />
                Quick Actions
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  gap: 3,
                  justifyContent: 'center',
                  alignItems: { xs: 'stretch', md: 'flex-start' },
                  mb: 2,
                }}
              >
                {quickActions.map((action, index) => (
                  <Card
                    key={index}
                    sx={{
                      flex: 1,
                      minWidth: 260,
                      maxWidth: 340,
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6,
                      },
                      background: `linear-gradient(45deg, ${action.color}15 30%, ${action.color}30 90%)`,
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          mb: 2,
                          p: 2,
                          borderRadius: 2,
                          bgcolor: `${action.color}15`,
                        }}
                      >
                        {action.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        align="center"
                        gutterBottom
                        sx={{ color: action.color }}
                      >
                        {action.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        align="center"
                      >
                        {action.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => navigate(action.path)}
                        variant="contained"
                        sx={{
                          bgcolor: action.color,
                          '&:hover': {
                            bgcolor: action.color,
                            opacity: 0.9,
                          },
                        }}
                      >
                        Go to {action.title}
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Getting Started Section */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                height: '100%',
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                borderRadius: 2,
              }}
            >
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  mb: 3,
                }}
              >
                <EmojiEventsIcon color="primary" />
                Getting Started
              </Typography>
              <List>
                {gettingStarted.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Avatar 
                          sx={{ 
                            bgcolor: 'primary.main',
                            width: 32,
                            height: 32,
                          }}
                        >
                          {item.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.text}
                        primaryTypographyProps={{ 
                          variant: 'body2',
                          sx: { fontWeight: 500 },
                        }}
                      />
                    </ListItem>
                    {index < gettingStarted.length - 1 && (
                      <Divider variant="inset" component="li" />
                    )}
                  </React.Fragment>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>

        {/* Help Section */}
        <Paper 
          sx={{ 
            p: 4, 
            mt: 4, 
            background: 'linear-gradient(45deg, #f8f9fa 30%, #e9ecef 90%)',
            borderRadius: 2,
          }}
        >
          <Stack spacing={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.main',
              }}
            >
              <HelpIcon />
              Need Help?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              If you need assistance or have any questions, please contact the system administrator.
              You can also refer to the user guide for detailed instructions on using the system.
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<HelpIcon />}
              sx={{ alignSelf: 'flex-start' }}
            >
              View User Guide
            </Button>
          </Stack>
        </Paper>
      </Box>
    </Container>
  );
}

export default Welcome; 