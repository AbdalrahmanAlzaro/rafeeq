const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const {
  getSubjects,
  createSubject,
  getTopicsBySubject,
  createTopic,
} = require('../controllers/subjectController');

router.get('/', getSubjects);
router.post('/', auth, isAdmin, createSubject);
router.get('/:id/topics', getTopicsBySubject);
router.post('/:id/topics', auth, isAdmin, createTopic);

module.exports = router;
