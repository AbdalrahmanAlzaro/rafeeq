const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  sendMessage,
  getChatHistory,
  getMyConversations,
  addTeacherNote,
  getTeacherNotes,
  chatbot,
  getChatbotHistory,
  getMyChatbotSessions,
  markMessageRead,
} = require("../controllers/messageController");

router.post("/", auth, sendMessage);
router.get("/conversations", auth, getMyConversations);
router.get("/chat/:user_id", auth, getChatHistory);
router.post("/note", auth, addTeacherNote);
router.get("/notes/:child_id", auth, getTeacherNotes);
router.post("/chatbot", auth, chatbot);
router.get("/chatbot/sessions", auth, getMyChatbotSessions);
router.get("/chatbot/:session_id", auth, getChatbotHistory);
router.put("/:id/read", auth, markMessageRead);

module.exports = router;
