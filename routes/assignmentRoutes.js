const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isTeacher = require("../middleware/isTeacher");
const {
  createAssignment,
  getChildAssignments,
  getMyAssignments,
  getAssignment,
  updateAssignment,
  submitAssignment,
  giveFeedback,
  deleteAssignment,
} = require("../controllers/assignmentController");

router.post("/", auth, isTeacher, createAssignment);
router.get("/my", auth, isTeacher, getMyAssignments);
router.get("/child/:child_id", auth, getChildAssignments);
router.get("/:id", auth, getAssignment);
router.put("/:id", auth, isTeacher, updateAssignment);
router.post("/:id/submit", auth, submitAssignment);
router.put("/:id/feedback", auth, isTeacher, giveFeedback);
router.delete("/:id", auth, isTeacher, deleteAssignment);

module.exports = router;
