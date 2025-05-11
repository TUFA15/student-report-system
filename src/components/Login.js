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
  Divider,
} from '@mui/material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    
    // Check teacher login
    const registeredTeachers = JSON.parse(localStorage.getItem('registeredTeachers')) || [];
    const teacher = registeredTeachers.find(t => t.email === email && t.password === password);
    
    if (teacher) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', 'teacher');
      localStorage.setItem('currentUser', JSON.stringify({ name: teacher.name, email: teacher.email }));
      navigate('/dashboard');
    } else {
      setError('Invalid teacher credentials.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>Teacher Login</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
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
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  Register here
                </Link>
              </Typography>
            </Box>
          </form>
          
          <Divider sx={{ my: 3 }}>OR</Divider>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>Student Access</Typography>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              component={Link}
              to="/student/login"
              sx={{ mb: 2 }}
            >
              Student Login
            </Button>
            <Typography variant="body2">
              New student?{' '}
              <Link to="/student/register" style={{ textDecoration: 'none' }}>
                Register here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 