const express = require('express');
const router = express.Router();
const { getHomework, submitHomework, approveHomework } = require('../controllers/homeworkController');
const auth = require('../middleware/auth');
const isParent = require('../middleware/isParent');
const isTeacher = require('../middleware/isTeacher');

router.get('/:id', auth, getHomework);
router.post('/:id/submit', auth, isParent, submitHomework);
router.put('/:id/approve', auth, isTeacher, approveHomework);

module.exports = router;
