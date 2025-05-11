import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Person as PersonIcon,
  AssignmentTurnedIn as AssignmentTurnedInIcon,
} from '@mui/icons-material';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [attendanceData, setAttendanceData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const location = useLocation();

  const reloadData = () => {
    let loadedStudents = JSON.parse(localStorage.getItem('students')) || [];
    // Migration: ensure every student has an id
    let changed = false;
    loadedStudents = loadedStudents.map(s => {
      if (!s.id) { changed = true; return { ...s, id: s.studentId }; }
      return s;
    });
    if (changed) localStorage.setItem('students', JSON.stringify(loadedStudents));
    setStudents(loadedStudents);
    setAttendanceData(JSON.parse(localStorage.getItem('attendance')) || {});
  };

  useEffect(() => {
    reloadData();
    window.addEventListener('focus', reloadData);
    window.addEventListener('storage', reloadData);
    return () => {
      window.removeEventListener('focus', reloadData);
      window.removeEventListener('storage', reloadData);
    };
  }, []);

  // Reload data whenever the route changes (i.e., you navigate to /students)
  useEffect(() => {
    reloadData();
  }, [location]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateAverageGrade = (grades) => {
    if (!grades || grades.length === 0) return 'N/A';
    const sum = grades.reduce((acc, curr) => acc + curr.grade, 0);
    return (sum / grades.length).toFixed(2);
  };

  const getGradeColor = (average) => {
    if (average === 'N/A') return 'default';
    const num = parseFloat(average);
    if (num >= 90) return 'success';
    if (num >= 70) return 'primary';
    if (num >= 50) return 'warning';
    return 'error';
  };

  const getGradeProgress = (average) => {
    if (average === 'N/A') return 0;
    return parseFloat(average);
  };

  const handleViewReport = (studentId) => {
    navigate(`/student/${studentId}`);
  };

  // Attendance summary for a student
  const getAttendanceStats = (studentId) => {
    let present = 0;
    let total = 0;
    Object.values(attendanceData).forEach(day => {
      if (studentId in day) {
        total++;
        if (day[studentId]) present++;
      }
    });
    const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
    return { present, total, percent };
  };

  const handleClearAllStudents = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleDialogConfirm = () => {
    localStorage.removeItem('students');
    localStorage.removeItem('attendance');
    setStudents([]);
    setAttendanceData({});
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        {/* Header Section */}
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
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SchoolIcon sx={{ fontSize: 40 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Student List
              </Typography>
              <Typography variant="body1">
                View and manage student records and performance
              </Typography>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                onClick={handleClearAllStudents}
                sx={{ ml: 2 }}
              >
                Clear All Students
              </Button>
            </Grid>
          </Grid>
        </Paper>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Clear All Students?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              This will remove all students and their attendance data. This action cannot be undone. Are you sure you want to proceed?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDialogConfirm} color="error" variant="contained">
              Clear All
            </Button>
          </DialogActions>
        </Dialog>

        {/* Search and Stats Section */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3,
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                borderRadius: 2,
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
                    </InputAdornment>
                  ),
                }}
              />
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon color="primary" />
                  Total Students
                </Typography>
                <Typography variant="h3" color="primary" sx={{ mb: 1 }}>
                  {students.length}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Student Table Section */}
        {filteredStudents.length === 0 ? (
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              mt: 4,
              textAlign: 'center',
              background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No students found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Try adjusting your search or add new students
            </Typography>
          </Paper>
        ) : (
          <TableContainer 
            component={Paper} 
            elevation={3}
            sx={{ 
              mt: 4,
              borderRadius: 2,
              overflow: 'hidden',
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: 'primary.main' }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Student</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Grades</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Performance</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Attendance</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => {
                  const att = getAttendanceStats(student.id);
                  return (
                    <TableRow 
                      key={student.id}
                      sx={{ 
                        '&:hover': { 
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {student.name.charAt(0)}
                          </Avatar>
                          <Typography variant="body1">
                            {student.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={student.studentId}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <GradeIcon color="primary" fontSize="small" />
                          <Typography variant="body2">
                            {student.grades.length} grades
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack spacing={1}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip
                              label={`${calculateAverageGrade(student.grades)}%`}
                              color={getGradeColor(calculateAverageGrade(student.grades))}
                              size="small"
                            />
                          </Box>
                          <LinearProgress 
                            variant="determinate" 
                            value={getGradeProgress(calculateAverageGrade(student.grades))}
                            color={getGradeColor(calculateAverageGrade(student.grades))}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Tooltip title="Update attendance from Attendance Tracker">
                            <span style={{ display: 'flex', alignItems: 'center' }}>
                              <AssignmentTurnedInIcon color="primary" />
                              <Typography variant="body2" sx={{ ml: 0.5 }}>
                                {att.percent !== 'N/A' ? `${att.percent}%` : 'N/A'}
                              </Typography>
                            </span>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Tooltip title="View Progress Report">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/progress?studentId=${student.id}`)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <TrendingUpIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Detailed Report">
                            <IconButton
                              color="primary"
                              onClick={() => navigate(`/student/${student.id}`)}
                              sx={{ 
                                '&:hover': { 
                                  backgroundColor: 'primary.light',
                                  color: 'white',
                                },
                              }}
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="View Attendance">
                            <IconButton color="primary" onClick={() => navigate(`/attendance?studentId=${student.id}`)}>
                              <AssignmentTurnedInIcon />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SchoolIcon color="primary" />
                  Total Students
                </Typography>
                <Typography variant="h3" color="primary">
                  {students.length}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ height: 8, borderRadius: 4, mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GradeIcon color="primary" />
                  Total Grades
                </Typography>
                <Typography variant="h3" color="primary">
                  {students.reduce((acc, student) => acc + student.grades.length, 0)}
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={100} 
                  sx={{ height: 8, borderRadius: 4, mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card 
              elevation={3}
              sx={{ 
                height: '100%',
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="primary" />
                  Average Performance
                </Typography>
                <Typography variant="h3" color="primary">
                  {students.length > 0
                    ? (students.reduce((acc, student) => {
                        const avg = calculateAverageGrade(student.grades);
                        return acc + (avg === 'N/A' ? 0 : parseFloat(avg));
                      }, 0) / students.length).toFixed(2)
                    : '0'}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={students.length > 0
                    ? (students.reduce((acc, student) => {
                        const avg = calculateAverageGrade(student.grades);
                        return acc + (avg === 'N/A' ? 0 : parseFloat(avg));
                      }, 0) / students.length)
                    : 0} 
                  sx={{ height: 8, borderRadius: 4, mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default StudentList; 