const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getAdminStats);
router.post('/quizzes/create', adminController.createQuiz);
router.put('/quizzes/:id', adminController.updateQuiz);

module.exports = router;
