const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// Traffic flow routes
router.get('/traffic', trafficController.getTrafficData);
router.get('/traffic/incidents', trafficController.getTrafficIncidents);

// Weather data route
router.get('/weather', trafficController.getWeatherData);

// Historical data routes
router.get('/traffic/history', trafficController.getHistoricalTrafficData);
router.get('/traffic/stats', trafficController.getTrafficStats);

module.exports = router;