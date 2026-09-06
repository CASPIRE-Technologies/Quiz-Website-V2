const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

// Protect all admin endpoints with JWT verification and admin role check
router.get('/stats', verifyToken, requireRole('admin'), adminController.getAdminStats);
router.get('/users', verifyToken, requireRole('admin'), adminController.getUsers);
router.post('/quizzes/create', verifyToken, requireRole('admin'), adminController.createQuiz);
router.put('/quizzes/:id', verifyToken, requireRole('admin'), adminController.updateQuiz);

// Question Management Endpoints
router.get('/questions', verifyToken, requireRole('admin'), adminController.getQuestions);
router.post('/questions/create', verifyToken, requireRole('admin'), adminController.createQuestion);
router.delete('/questions/:id', verifyToken, requireRole('admin'), adminController.deleteQuestion);

module.exports = router;

