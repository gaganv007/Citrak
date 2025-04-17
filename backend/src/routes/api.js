const express = require('express');
const TrafficController = require('../controllers/trafficController');
const UserController = require('../controllers/userController');

const router = express.Router();
const trafficController = new TrafficController();
const userController = new UserController();

// Traffic data routes
router.get('/traffic', trafficController.getTrafficData.bind(trafficController));
router.post('/traffic', trafficController.updateTrafficData.bind(trafficController));

// User authentication routes
router.post('/register', userController.registerUser.bind(userController));
router.post('/login', userController.loginUser.bind(userController));

module.exports = router;