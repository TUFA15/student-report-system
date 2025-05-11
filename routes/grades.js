const express = require('express');
const router = express.Router();
const Grade = require('../models/Grade');
const { teacherAuth, studentAuth } = require('../middleware/auth');

// Get all grades (teachers only)
router.get('/', teacherAuth, async (req, res) => {
  try {
    const grades = await Grade.find()
      .populate('studentId', 'rollNumber')
      .populate('gradedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get grades for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const grades = await Grade.find({ studentId: req.params.studentId })
      .populate('gradedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new grade (teachers only)
router.post('/', teacherAuth, async (req, res) => {
  try {
    const grade = new Grade({
      ...req.body,
      gradedBy: req.user._id
    });

    const newGrade = await grade.save();
    res.status(201).json(newGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update grade (teachers only)
router.patch('/:id', teacherAuth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    Object.assign(grade, req.body);
    const updatedGrade = await grade.save();
    res.json(updatedGrade);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete grade (teachers only)
router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.id);
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    await grade.remove();
    res.json({ message: 'Grade deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 