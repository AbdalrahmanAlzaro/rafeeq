const express = require('express');
const router = express.Router();
const { createChild, updateChild, getChildProgress } = require('../controllers/childController');
const auth = require('../middleware/auth');
const isTeacher = require('../middleware/isTeacher');

router.post('/', auth, isTeacher, createChild);
router.put('/:id', auth, isTeacher, updateChild);
router.get('/:id/progress', auth, getChildProgress);

module.exports = router;
