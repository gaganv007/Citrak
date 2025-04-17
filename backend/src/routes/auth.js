const express = require('express');
const UserController = require('../controllers/userController');

const router = express.Router();
const userController = new UserController();

// User registration route
router.post('/register', (req, res) => {
    userController.registerUser(req, res);
});

// User login route
router.post('/login', (req, res) => {
    userController.loginUser(req, res);
});

module.exports = router;