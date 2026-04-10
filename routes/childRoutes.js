const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addChild,
  getMyChildren,
  getChild,
  updateChild,
  updateNotes,
  assignTeacher,
  getTeacherStudents,
  deactivateChild,
} = require("../controllers/childController");

router.post("/", auth, addChild);
router.get("/", auth, getMyChildren);
router.get("/my-students", auth, getTeacherStudents);
router.get("/:id", auth, getChild);
router.put("/:id", auth, updateChild);
router.put("/:id/notes", auth, updateNotes);
router.put("/:id/assign-teacher", auth, assignTeacher);
router.delete("/:id", auth, deactivateChild);

module.exports = router;
