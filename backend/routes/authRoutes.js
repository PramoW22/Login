const express = require('express');
const AuthController = require('../controllers/authController');
const adminController=require('../controllers/adminController');
const router = express.Router();

// router.get('/users', authenticateToken, authorizeRole('admin'), getUsers);
// router.delete('/users/:id', authenticateToken, authorizeRole('admin'), deleteUser);

router.post('/signup', AuthController.register);
router.post('/login', AuthController.login);
router.post('/admin-login',adminController.login);
router.post('/verify-otp', adminController.verifyOTP);

module.exports = router;
 