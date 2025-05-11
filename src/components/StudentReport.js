import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function StudentReport() {
  const { id } = useParams();

  // Sample data - in a real application, this would come from an API
  const studentData = {
    id: id,
    name: 'John Doe',
    grade: '10th',
    class: 'A',
    attendance: 95,
    performance: [
      { month: 'Jan', score: 85 },
      { month: 'Feb', score: 88 },
      { month: 'Mar', score: 82 },
      { month: 'Apr', score: 90 },
      { month: 'May', score: 87 },
    ],
    subjects: [
      { name: 'Mathematics', grade: 'A', score: 92 },
      { name: 'Science', grade: 'B+', score: 88 },
      { name: 'English', grade: 'A-', score: 89 },
      { name: 'History', grade: 'B', score: 85 },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Report
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Student Information
            </Typography>
            <Typography>Name: {studentData.name}</Typography>
            <Typography>Grade: {studentData.grade}</Typography>
            <Typography>Class: {studentData.class}</Typography>
            <Typography>Attendance: {studentData.attendance}%</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Performance Trend
            </Typography>
            <LineChart width={500} height={300} data={studentData.performance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="score" stroke="#1976d2" />
            </LineChart>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Subject-wise Performance
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Subject</TableCell>
                    <TableCell>Grade</TableCell>
                    <TableCell>Score</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentData.subjects.map((subject) => (
                    <TableRow key={subject.name}>
                      <TableCell>{subject.name}</TableCell>
                      <TableCell>{subject.grade}</TableCell>
                      <TableCell>{subject.score}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default StudentReport; 