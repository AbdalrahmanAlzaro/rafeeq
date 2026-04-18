const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, getMyChildren, getChildDetail, completeProfile } = require('../controllers/teacherController');
const auth = require('../middleware/auth');
const isTeacher = require('../middleware/isTeacher');

router.use(auth, isTeacher);

router.post('/complete-profile', completeProfile);
router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.get('/children', getMyChildren);
router.get('/children/:child_id', getChildDetail);

module.exports = router;
