const express = require('express');
const { loginUser } = require('../controllers/authController');
const { forgotPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/login', loginUser);
router.post("/forgot-password", forgotPassword);
//router.post('/register', registerUser);

module.exports = router;
