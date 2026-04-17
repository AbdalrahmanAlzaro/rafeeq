const express = require('express');
const router = express.Router();
const { getActivity, completeActivity } = require('../controllers/activityController');
const auth = require('../middleware/auth');
const isParent = require('../middleware/isParent');

router.get('/:id', auth, getActivity);
router.post('/:id/complete', auth, isParent, completeActivity);

module.exports = router;
