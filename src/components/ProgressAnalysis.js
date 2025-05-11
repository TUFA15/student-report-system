import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  InputAdornment,
  Divider,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonIcon from '@mui/icons-material/Person';
import SubjectIcon from '@mui/icons-material/AutoStories';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useSearchParams } from 'react-router-dom';

function ProgressAnalysis({ studentOnly }) {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [progressData, setProgressData] = useState({});
  const [subjectAverages, setSubjectAverages] = useState([]);
  const [error, setError] = useState('');
  const [attendanceData, setAttendanceData] = useState({});
  const [weekDates, setWeekDates] = useState([]);
  const [searchParams] = useSearchParams();

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
  ];

  useEffect(() => {
    // Load students from localStorage
    let loadedStudents = JSON.parse(localStorage.getItem('students')) || [];
    // Migration: ensure every student has an id
    let changed = false;
    loadedStudents = loadedStudents.map(s => {
      if (!s.id) { changed = true; return { ...s, id: s.studentId }; }
      return s;
    });
    if (changed) localStorage.setItem('students', JSON.stringify(loadedStudents));
    if (loadedStudents.length === 0) {
      setError('No student data available. Please add grades first.');
    }
    // If studentOnly, filter to just the current student
    if (studentOnly) {
      const currentStudent = JSON.parse(localStorage.getItem('currentStudent'));
      if (currentStudent && currentStudent.id) {
        setStudents([currentStudent]);
        setSelectedStudent(currentStudent.id);
      } else {
        setStudents([]);
      }
    } else {
      setStudents(loadedStudents);
      // Auto-select student from query string if present
      const studentIdFromQuery = searchParams.get('studentId');
      if (studentIdFromQuery && loadedStudents.some(s => s.id === studentIdFromQuery)) {
        setSelectedStudent(studentIdFromQuery);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      const student = students.find(s => s.id === selectedStudent);
      if (student) {
        try {
          // Prepare data for the line chart
          const gradesBySubject = {};
          student.grades.forEach(grade => {
            if (!gradesBySubject[grade.subject]) {
              gradesBySubject[grade.subject] = [];
            }
            gradesBySubject[grade.subject].push({
              semester: grade.semester,
              grade: grade.grade,
              date: new Date(grade.date).toLocaleDateString(),
            });
          });

          // Sort grades by semester
          Object.keys(gradesBySubject).forEach(subject => {
            gradesBySubject[subject].sort((a, b) => a.semester - b.semester);
          });

          // Calculate subject averages
          const averages = subjects.map(subject => {
            const subjectGrades = gradesBySubject[subject] || [];
            const average = subjectGrades.length > 0
              ? subjectGrades.reduce((acc, curr) => acc + curr.grade, 0) / subjectGrades.length
              : 0;
            return {
              subject,
              average: parseFloat(average.toFixed(2)),
            };
          });

          setSubjectAverages(averages);
          setProgressData(gradesBySubject);
          setError('');
        } catch (err) {
          setError('Error processing student data. Please try again.');
        }
      }
    }
  }, [selectedStudent, students]);

  useEffect(() => {
    // Load attendance from localStorage
    const allAttendance = JSON.parse(localStorage.getItem('attendance')) || {};
    setAttendanceData(allAttendance);
    // Set current week dates
    const today = new Date();
    setWeekDates(getWeekDates(today.toISOString().split('T')[0]));
  }, []);

  // Helper to get current week dates
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

  // Calculate weekly attendance for selected student
  const getWeeklyAttendance = (studentId) => {
    if (!studentId || weekDates.length === 0) return { present: 0, total: 0, percent: 'N/A' };
    let present = 0;
    let total = weekDates.length;
    weekDates.forEach(date => {
      const key = date.toISOString().split('T')[0];
      if (attendanceData[key] && attendanceData[key][studentId]) present++;
    });
    const percent = total > 0 ? ((present / total) * 100).toFixed(1) : 'N/A';
    return { present, total, percent };
  };

  const handleStudentChange = (event) => {
    setSelectedStudent(event.target.value);
  };

  const handleSubjectChange = (event) => {
    setSelectedSubject(event.target.value);
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': '#8884d8',
      'Science': '#82ca9d',
      'English': '#ffc658',
      'History': '#ff8042',
      'Geography': '#0088fe',
      'Computer Science': '#00C49F',
    };
    return colors[subject] || '#8884d8';
  };

  return (
    <Container maxWidth="lg">
      {/* Gradient Header */}
      <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 3, background: 'linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)', color: 'white', display: 'flex', alignItems: 'center', gap: 2 }}>
        <BarChartIcon sx={{ fontSize: 48 }} />
        <Typography variant="h3" fontWeight={700} sx={{ ml: 2 }}>
          Progress Analysis
        </Typography>
      </Paper>

      {error && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* All Students Overview Table */}
      {students.length > 0 && !studentOnly && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(90deg, #f5fafd 0%, #ffffff 100%)', boxShadow: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
            All Students Overview
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Student ID</TableCell>
                  <TableCell align="center">Average Grade</TableCell>
                  <TableCell align="center">Attendance (%)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => {
                  // Calculate average grade
                  const avgGrade = student.grades && student.grades.length > 0
                    ? (student.grades.reduce((acc, g) => acc + g.grade, 0) / student.grades.length).toFixed(2)
                    : 'N/A';
                  // Calculate attendance
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
                    <TableRow key={student.id} selected={selectedStudent === student.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(student.id)}>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.studentId}</TableCell>
                      <TableCell align="center">{avgGrade}</TableCell>
                      <TableCell align="center">{attendancePercent}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {/* Selectors Section */}
      {!studentOnly && (
        <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(90deg, #f5fafd 0%, #ffffff 100%)', boxShadow: 3 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Student</InputLabel>
                <Select
                  value={selectedStudent}
                  onChange={handleStudentChange}
                  label="Select Student"
                  startAdornment={
                    <InputAdornment position="start">
                      <PersonIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  {students.map((student) => (
                    <MenuItem key={student.id} value={student.id}>
                      {student.name} ({student.studentId})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Select Subject</InputLabel>
                <Select
                  value={selectedSubject}
                  onChange={handleSubjectChange}
                  label="Select Subject"
                  startAdornment={
                    <InputAdornment position="start">
                      <SubjectIcon color="primary" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="all">All Subjects</MenuItem>
                  {subjects.map((subject) => (
                    <MenuItem key={subject} value={subject}>
                      {subject}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Stat Cards Section */}
      {selectedStudent && !error && (
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, textAlign: 'center', background: 'linear-gradient(135deg, #f5fafd 30%, #e3f2fd 90%)' }}>
              <Avatar sx={{ bgcolor: 'info.main', width: 48, height: 48, mx: 'auto', mb: 1 }}>
                <EventAvailableIcon />
              </Avatar>
              <Typography variant="h6">Weekly Attendance</Typography>
              <Typography variant="h3" color="info.main" fontWeight={700}>{getWeeklyAttendance(selectedStudent).percent}%</Typography>
              <Typography variant="body2" color="text.secondary">
                {getWeeklyAttendance(selectedStudent).present} / {getWeeklyAttendance(selectedStudent).total} days present
              </Typography>
            </Paper>
          </Grid>
          {/* Add more stat cards here if needed */}
        </Grid>
      )}

      {/* Analytics Section */}
      {selectedStudent && !error && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f5f5 30%, #ffffff 90%)', mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUpIcon color="primary" /> Grade Progress Over Time
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                {selectedSubject === 'all'
                  ? subjects.every(subject => !progressData[subject] || progressData[subject].length === 0) ? (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 10 }}>
                        No grade data available for this student.
                      </Typography>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="semester" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          {subjects.map(subject => (
                            progressData[subject] && progressData[subject].length > 0 && (
                              <Line
                                key={subject}
                                type="monotone"
                                data={progressData[subject]}
                                dataKey="grade"
                                name={subject}
                                stroke={getSubjectColor(subject)}
                                activeDot={{ r: 8 }}
                              />
                            )
                          ))}
                        </LineChart>
                      </ResponsiveContainer>
                    )
                  : !progressData[selectedSubject] || progressData[selectedSubject].length === 0 ? (
                      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 10 }}>
                        No grade data available for this subject.
                      </Typography>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={progressData[selectedSubject]} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="semester" />
                          <YAxis domain={[0, 100]} />
                          <Tooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="grade"
                            name={selectedSubject}
                            stroke={getSubjectColor(selectedSubject)}
                            activeDot={{ r: 8 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    )}
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f5f5f5 30%, #ffffff 90%)', mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SubjectIcon color="primary" /> Subject Averages
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ height: 300 }}>
                {subjectAverages.every(s => !s.average || s.average === 0) ? (
                  <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 10 }}>
                    No subject average data available for this student.
                  </Typography>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={subjectAverages} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="average" name="Average Grade" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Subject Cards Section */}
      {selectedStudent && !error && (
        <Grid container spacing={3} sx={{ mt: 2 }}>
          {subjectAverages.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject.subject}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, background: 'linear-gradient(135deg, #e3f2fd 30%, #ffffff 90%)', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 8 } }}>
                <CardContent>
                  <Stack spacing={1} alignItems="center">
                    <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                      <SubjectIcon />
                    </Avatar>
                    <Typography variant="h6" gutterBottom>
                      {subject.subject}
                    </Typography>
                    <Typography variant="h4" color="primary" fontWeight={700}>
                      {subject.average}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Average Grade
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default ProgressAnalysis; 