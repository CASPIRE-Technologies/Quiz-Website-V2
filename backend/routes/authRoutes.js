const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/google', authController.googleAuth);
router.get('/profile', verifyToken, authController.getProfile);
router.put('/exam-level', verifyToken, authController.updateExamLevel);

module.exports = router;
