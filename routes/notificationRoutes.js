const express = require('express');
const router = express.Router();
const {
  getMyNotifications, getUnreadCount, markOneRead, markAllRead, deleteOne,
} = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/', getMyNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/read-all', markAllRead);
router.put('/:id/read', markOneRead);
router.delete('/:id', deleteOne);

module.exports = router;
