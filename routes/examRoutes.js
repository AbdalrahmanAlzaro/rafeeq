const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isTeacher = require("../middleware/isTeacher");
const {
  createExam,
  getChildExam,
  getExam,
  startExam,
  submitExam,
  getExamResult,
} = require("../controllers/examController");

router.post("/", auth, isTeacher, createExam);
router.get("/child/:child_id", auth, getChildExam);
router.get("/:id", auth, getExam);
router.put("/:id/start", auth, startExam);
router.post("/:id/submit", auth, submitExam);
router.get("/:id/result", auth, getExamResult);

module.exports = router;
