const express = require('express');
const router = express.Router();
const { startSession, sendMessage, getSessions, getSessionMessages } = require('../controllers/chatbotController');
const auth = require('../middleware/auth');

router.use(auth);

router.post('/sessions', startSession);
router.post('/message', sendMessage);
router.get('/sessions', getSessions);
router.get('/sessions/:session_id/messages', getSessionMessages);

module.exports = router;
