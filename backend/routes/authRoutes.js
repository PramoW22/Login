const express = require('express');
const AuthController = require('../controllers/authController');
const { getUsers, deleteUser } = require('../controllers/adminController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { signup, login } = require('../controllers/authController');
const router = express.Router();

router.get('/users', authenticateToken, authorizeRole('admin'), getUsers);
router.delete('/users/:id', authenticateToken, authorizeRole('admin'), deleteUser);

router.post('/signup', AuthController.register);
router.post('/login', AuthController.login);

module.exports = router;
 