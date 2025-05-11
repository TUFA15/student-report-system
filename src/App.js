import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import StudentReport from './components/StudentReport';
import AddGrade from './components/AddGrade';
import Login from './components/Login';
import Register from './components/Register';
import ProgressAnalysis from './components/ProgressAnalysis';
import AttendanceTracking from './components/AttendanceTracking';
import UserPage from './components/UserPage';
import ProtectedRoute from './components/ProtectedRoute';
import StudentLogin from './components/student/StudentLogin';
import StudentRegister from './components/student/StudentRegister';
import StudentDashboard from './components/student/StudentDashboard';
import StudentProtectedRoute from './components/student/StudentProtectedRoute';
import StudentWelcome from './components/student/StudentWelcome';
import StudentProgress from './components/student/StudentProgress';
import StudentAttendance from './components/student/StudentAttendance';
import StudentLogout from './components/student/StudentLogout';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <div className="App">
          <Routes>
            {/* Teacher routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected teacher routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <Dashboard />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/students" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <StudentList />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/student/:id" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <StudentReport />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/add-grade" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <AddGrade />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <ProgressAnalysis />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/attendance" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <AttendanceTracking />
                  </div>
                </>
              </ProtectedRoute>
            } />
            <Route path="/user" element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <div className="content">
                    <UserPage />
                  </div>
                </>
              </ProtectedRoute>
            } />

            {/* Student routes */}
            <Route path="/student/login" element={<StudentLogin />} />
            <Route path="/student/register" element={<StudentRegister />} />
            <Route path="/student/welcome" element={<StudentWelcome />} />
            <Route path="/student/progress" element={<StudentProgress />} />
            <Route path="/student/attendance" element={<StudentAttendance />} />
            <Route path="/student/logout" element={<StudentLogout />} />
            
            {/* Protected student routes */}
            <Route path="/student/dashboard" element={
              <StudentProtectedRoute>
                <StudentDashboard />
              </StudentProtectedRoute>
            } />
            {/* Redirect student root to welcome */}
            <Route path="/student" element={<StudentWelcome />} />
            
            {/* Catch all route - redirect to teacher login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
