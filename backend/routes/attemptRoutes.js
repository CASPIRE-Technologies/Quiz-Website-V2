const express = require('express');
const router = express.Router();
const attemptController = require('../controllers/attemptController');

router.post('/submit', attemptController.submitAttempt);
router.get('/:id/result', attemptController.getAttemptResult);

module.exports = router;
