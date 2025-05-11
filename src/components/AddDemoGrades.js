import React from 'react';
import { Button, Paper, Typography, Box } from '@mui/material';

const demoGrades = [
  {
    subject: 'Mathematics',
    grade: 85,
    semester: 'Fall 2023',
    date: new Date('2023-09-15').toISOString(),
  },
  {
    subject: 'Science',
    grade: 78,
    semester: 'Fall 2023',
    date: new Date('2023-10-10').toISOString(),
  },
  {
    subject: 'English',
    grade: 92,
    semester: 'Spring 2024',
    date: new Date('2024-02-20').toISOString(),
  },
  {
    subject: 'Mathematics',
    grade: 88,
    semester: 'Spring 2024',
    date: new Date('2024-03-15').toISOString(),
  },
  {
    subject: 'Science',
    grade: 81,
    semester: 'Spring 2024',
    date: new Date('2024-04-10').toISOString(),
  },
];

function AddDemoGrades() {
  const handleAddDemoGrades = () => {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    students = students.map(student => ({
      ...student,
      grades: demoGrades,
    }));
    localStorage.setItem('students', JSON.stringify(students));
    alert('Demo grades added to all students! Go to Progress Analysis to see the charts.');
  };

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          Add Demo Grades for Testing
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddDemoGrades}>
          Add Demo Grades
        </Button>
      </Paper>
    </Box>
  );
}

export default AddDemoGrades; 