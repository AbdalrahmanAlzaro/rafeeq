const express = require('express');
const router = express.Router();
const { getQuestions, startAssessment, submitAssessment, getAssessmentResult } = require('../controllers/assessmentController');
const auth = require('../middleware/auth');
const isTeacher = require('../middleware/isTeacher');

router.get('/questions', auth, getQuestions);
router.post('/start', auth, isTeacher, startAssessment);
router.post('/:id/submit', auth, submitAssessment);
router.get('/:id/result', auth, getAssessmentResult);

module.exports = router;
