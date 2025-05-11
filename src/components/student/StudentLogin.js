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

function StudentLogin() {
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !password) {
      setError('Please enter student ID and password.');
      return;
    }
    
    // Check student login
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.studentId === studentId && s.password === password);
    
    if (student) {
      localStorage.setItem('isStudentLoggedIn', 'true');
      localStorage.setItem('studentRole', 'student');
      localStorage.setItem('currentStudent', JSON.stringify(student));
      navigate('/student/dashboard');
    } else {
      setError('Invalid student credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>Student Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Student ID"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
            />
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Login
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/student/register" style={{ textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                Are you a teacher?{' '}
                <Link to="/login" style={{ textDecoration: 'none' }}>
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

export default StudentLogin; 