import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
} from '@mui/material';

function StudentRegister() {
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    password: '',
    confirmPassword: '',
    class: '',
    grade: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validate form
    if (!formData.name || !formData.studentId || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    // Check if student ID already exists
    const students = JSON.parse(localStorage.getItem('students')) || [];
    if (students.some(student => student.studentId === formData.studentId)) {
      setError('Student ID already registered.');
      return;
    }

    // Register new student
    const newStudent = {
      id: formData.studentId,
      name: formData.name,
      studentId: formData.studentId,
      password: formData.password,
      class: formData.class,
      grade: formData.grade,
      grades: [],
      attendance: 0,
      lastAttendanceUpdate: new Date().toLocaleDateString()
    };

    students.push(newStudent);
    localStorage.setItem('students', JSON.stringify(students));

    // Auto login after registration
    localStorage.setItem('isStudentLoggedIn', 'true');
    localStorage.setItem('studentRole', 'student');
    localStorage.setItem('currentStudent', JSON.stringify(newStudent));
    
    navigate('/student/dashboard');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>Student Registration</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Student ID"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Class"
              name="class"
              value={formData.class}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Grade"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Register
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Already have an account?{' '}
                <Link to="/student/login" style={{ textDecoration: 'none' }}>
                  Login here
                </Link>
              </Typography>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}

export default StudentRegister; 