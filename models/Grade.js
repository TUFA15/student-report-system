const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  grade: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  term: {
    type: String,
    required: true,
    enum: ['First Term', 'Mid Term', 'Final Term']
  },
  academicYear: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  },
  gradedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate grades for same subject and term
gradeSchema.index({ studentId: 1, subject: 1, term: 1, academicYear: 1 }, { unique: true });

const Grade = mongoose.model('Grade', gradeSchema);
module.exports = Grade; 