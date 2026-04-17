const express = require('express');
const router = express.Router();
const { getQuiz, startQuiz, submitQuiz } = require('../controllers/quizController');
const auth = require('../middleware/auth');

router.get('/:id', auth, getQuiz);
router.post('/:id/start', auth, startQuiz);
router.post('/:id/submit', auth, submitQuiz);

module.exports = router;
