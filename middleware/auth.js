const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({ _id: decoded.userId });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const teacherAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Access denied. Teachers only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

const studentAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {
      if (req.user.role !== 'student') {
        return res.status(403).json({ message: 'Access denied. Students only.' });
      }
      next();
    });
  } catch (error) {
    res.status(401).json({ message: 'Please authenticate.' });
  }
};

module.exports = {
  auth,
  teacherAuth,
  studentAuth
}; 