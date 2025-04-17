const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const userController = require('../controllers/userController');
const config = require('../config');

// Auth middleware to protect routes
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, config.auth.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile', authMiddleware, userController.getProfile);
router.put('/preferences', authMiddleware, userController.updatePreferences);

module.exports = router;