const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { teacherAuth } = require('../middleware/auth');

// Get all attendance records (teachers only)
router.get('/', teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.find()
      .populate('studentId', 'rollNumber')
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const attendance = await Attendance.find({ studentId: req.params.studentId })
      .populate('markedBy', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance for a specific date
router.get('/date/:date', teacherAuth, async (req, res) => {
  try {
    const startDate = new Date(req.params.date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(req.params.date);
    endDate.setHours(23, 59, 59, 999);

    const attendance = await Attendance.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('studentId', 'rollNumber')
    .populate('markedBy', 'name');
    
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Mark attendance (teachers only)
router.post('/', teacherAuth, async (req, res) => {
  try {
    const attendance = new Attendance({
      ...req.body,
      markedBy: req.user._id
    });

    const newAttendance = await attendance.save();
    res.status(201).json(newAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update attendance (teachers only)
router.patch('/:id', teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    Object.assign(attendance, req.body);
    const updatedAttendance = await attendance.save();
    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance record (teachers only)
router.delete('/:id', teacherAuth, async (req, res) => {
  try {
    const attendance = await Attendance.findById(req.params.id);
    
    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.remove();
    res.json({ message: 'Attendance record deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 