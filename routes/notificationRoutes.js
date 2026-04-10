const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getMyNotifications,
  getUnreadCount,
  markOneRead,
  markAllRead,
  deleteNotification,
  deleteAllRead,
} = require("../controllers/notificationController");

router.get("/", auth, getMyNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.put("/read-all", auth, markAllRead);
router.delete("/read", auth, deleteAllRead);
router.put("/:id/read", auth, markOneRead);
router.delete("/:id", auth, deleteNotification);

module.exports = router;
