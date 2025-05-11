import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  Card,
  CardContent,
  Alert,
  Snackbar,
  InputAdornment,
  Divider,
  Switch,
  FormControlLabel,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  School as SchoolIcon,
  Grade as GradeIcon,
  Subject as SubjectIcon,
  CalendarToday as CalendarIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';

function AddGrade() {
  const [students, setStudents] = useState([]);
  const [isNewStudent, setIsNewStudent] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    studentName: '',
    subject: '',
    grade: '',
    semester: '',
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Literature',
  ];

  const semesters = [
    'Fall 2023',
    'Spring 2024',
    'Summer 2024',
  ];

  useEffect(() => {
    const loadedStudents = JSON.parse(localStorage.getItem('students')) || [];
    setStudents(loadedStudents);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const grade = parseFloat(formData.grade);
    if (isNaN(grade) || grade < 0 || grade > 100) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid grade between 0 and 100',
        severity: 'error',
      });
      return;
    }

    let updatedStudents = [...students];
    let studentIndex = updatedStudents.findIndex(
      (s) => s.studentId === formData.studentId
    );

    let studentIdToMark = formData.studentId;

    if (isNewStudent) {
      if (!formData.studentName.trim()) {
        setSnackbar({
          open: true,
          message: 'Please enter student name',
          severity: 'error',
        });
        return;
      }

      // Create new student
      const newStudent = {
        id: Date.now().toString(),
        name: formData.studentName,
        studentId: formData.studentId,
        grades: [{
          subject: formData.subject,
          grade: grade,
          semester: formData.semester,
          date: new Date().toISOString(),
        }],
      };
      updatedStudents.push(newStudent);
      studentIdToMark = newStudent.studentId;
    } else {
      if (studentIndex === -1) {
        setSnackbar({
          open: true,
          message: 'Student not found. Please create a new student entry.',
          severity: 'error',
        });
        return;
      }
      // Add grade to existing student
      updatedStudents[studentIndex].grades.push({
        subject: formData.subject,
        grade: grade,
        semester: formData.semester,
        date: new Date().toISOString(),
      });
    }

    localStorage.setItem('students', JSON.stringify(updatedStudents));
    setStudents(updatedStudents);

    // --- Mark attendance for today ---
    const today = new Date().toISOString().split('T')[0];
    const allAttendance = JSON.parse(localStorage.getItem('attendance')) || {};
    if (!allAttendance[today]) allAttendance[today] = {};
    // Find the student by studentId and get their unique id
    const studentObj = updatedStudents.find(s => s.studentId === studentIdToMark);
    if (studentObj) {
      allAttendance[today][studentObj.id] = true;
      localStorage.setItem('attendance', JSON.stringify(allAttendance));
    }
    // --- End attendance marking ---

    setSnackbar({
      open: true,
      message: isNewStudent ? 'New student and grade added successfully' : 'Grade added successfully',
      severity: 'success',
    });

    setFormData({
      studentId: '',
      studentName: '',
      subject: '',
      grade: '',
      semester: '',
    });
    setIsNewStudent(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
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
              <GradeIcon sx={{ fontSize: 40 }} />
            </Grid>
            <Grid item xs>
              <Typography variant="h4" gutterBottom>
                Add Grade
              </Typography>
              <Typography variant="body1">
                Record student grades and track academic performance
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={4}>
          {/* Main Form Section */}
          <Grid item xs={12} md={8}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 4,
                background: 'linear-gradient(45deg, #f5f5f5 30%, #ffffff 90%)',
                borderRadius: 2,
                height: '100%',
              }}
            >
              <form onSubmit={handleSubmit}>
                <Stack spacing={3}>
                  {/* New Student Toggle */}
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isNewStudent}
                        onChange={(e) => setIsNewStudent(e.target.checked)}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="subtitle1" fontWeight="medium">
                        Add New Student
                      </Typography>
                    }
                  />

                  {/* Student Information Section */}
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Student Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Student ID"
                          name="studentId"
                          value={formData.studentId}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SchoolIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      {isNewStudent && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Student Name"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonAddIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      )}

                      {!isNewStudent && (
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            select
                            label="Select Student"
                            name="studentId"
                            value={formData.studentId}
                            onChange={handleChange}
                            required
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SchoolIcon color="primary" />
                                </InputAdornment>
                              ),
                            }}
                          >
                            {students.map((student) => (
                              <MenuItem key={student.id} value={student.studentId}>
                                {student.name} ({student.studentId})
                              </MenuItem>
                            ))}
                          </TextField>
                        </Grid>
                      )}
                    </Grid>
                  </Box>

                  {/* Grade Information Section */}
                  <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1 }}>
                    <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                      Grade Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          select
                          label="Subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <SubjectIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          {subjects.map((subject) => (
                            <MenuItem key={subject} value={subject}>
                              {subject}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          select
                          label="Semester"
                          name="semester"
                          value={formData.semester}
                          onChange={handleChange}
                          required
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarIcon color="primary" />
                              </InputAdornment>
                            ),
                          }}
                        >
                          {semesters.map((semester) => (
                            <MenuItem key={semester} value={semester}>
                              {semester}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Grade"
                          name="grade"
                          type="number"
                          value={formData.grade}
                          onChange={handleChange}
                          required
                          inputProps={{ min: 0, max: 100, step: 0.1 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <GradeIcon color="primary" />
                              </InputAdornment>
                            ),
                            endAdornment: <InputAdornment position="end">%</InputAdornment>,
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    startIcon={<AddIcon />}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {isNewStudent ? 'Add New Student with Grade' : 'Add Grade'}
                  </Button>
                </Stack>
              </form>
            </Paper>
          </Grid>

          {/* Guidelines Card */}
          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GradeIcon color="primary" />
                    Grade Guidelines
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      • Grades should be between 0 and 100
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Use decimal points for precise grading
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Select the appropriate semester
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Choose from available subjects
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>

              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonAddIcon color="primary" />
                    New Student
                  </Typography>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">
                      • Toggle "Add New Student" to create a new student entry
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Enter student ID and name for new students
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Grade will be added automatically
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}

export default AddGrade; 