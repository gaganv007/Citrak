require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const config = require('./config');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to database
mongoose.connect(process.env.DATABASE_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// API key validation middleware
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  
  next();
};

// Routes
app.use('/api', validateApiKey, apiRoutes);
app.use('/auth', authRoutes);

// Simple health check route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', env: process.env.NODE_ENV });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Citrak server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});