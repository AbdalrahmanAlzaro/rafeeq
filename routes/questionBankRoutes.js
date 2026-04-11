const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const {
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsBySubjectAndLevel,
} = require("../controllers/questionBankController");

router.post("/", addQuestion);
router.get("/", getQuestions);
router.get(
  "/subject/:subject_id/level/:level_id",
  getQuestionsBySubjectAndLevel,
);
router.get("/:id", getQuestion);
router.put("/:id", updateQuestion);
router.delete("/:id", deleteQuestion);

module.exports = router;
