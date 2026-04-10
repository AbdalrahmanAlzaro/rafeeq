const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isTeacher = require("../middleware/isTeacher");
const isAdmin = require("../middleware/isAdmin");
const {
  addQuestion,
  getMyQuestions,
  getAllQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsBySubjectAndLevel,
} = require("../controllers/questionBankController");

router.post("/", auth, isTeacher, addQuestion);
router.get("/my", auth, isTeacher, getMyQuestions);
router.get("/all", auth, isAdmin, getAllQuestions);
router.get(
  "/subject/:subject_id/level/:level_id",
  auth,
  getQuestionsBySubjectAndLevel,
);
router.get("/:id", auth, getQuestion);
router.put("/:id", auth, isTeacher, updateQuestion);
router.delete("/:id", auth, deleteQuestion);

module.exports = router;
