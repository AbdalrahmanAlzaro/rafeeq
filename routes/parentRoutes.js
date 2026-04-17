const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, getMyChildren, getChildDetail } = require('../controllers/parentController');
const auth = require('../middleware/auth');
const isParent = require('../middleware/isParent');

router.use(auth, isParent);

router.get('/me', getMyProfile);
router.put('/me', updateProfile);
router.get('/children', getMyChildren);
router.get('/children/:child_id', getChildDetail);

module.exports = router;
