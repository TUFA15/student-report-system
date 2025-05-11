import React from 'react';
import StudentNavbar from './StudentNavbar';
import ProgressAnalysis from '../ProgressAnalysis';

function StudentProgress() {
  return (
    <>
      <StudentNavbar />
      <ProgressAnalysis studentOnly />
    </>
  );
}

export default StudentProgress; 