const express = require('express');
const router = express.Router();
const { getMySchool, updateSchool, getTeachers, getStats } = require('../controllers/schoolController');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');

router.use(auth, isAdmin);

router.get('/me', getMySchool);
router.put('/me', updateSchool);
router.get('/teachers', getTeachers);
router.get('/stats', getStats);

module.exports = router;
