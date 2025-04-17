const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User with that email or username already exists' 
      });
    }
    
    // Create new user
    const user = new User({
      username,
      email,
      password
    });
    
    await user.save();
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.auth.jwtSecret,
      { expiresIn: '1d' }
    );
    
    // Return user data (excluding password) and token
    res.status(201).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      },
      token
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      config.auth.jwtSecret,
      { expiresIn: '1d' }
    );
    
    // Return user data and token
    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        preferences: user.preferences
      },
      token
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update user preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { preferences },
      { new: true, runValidators: true }
    ).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
    
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
};