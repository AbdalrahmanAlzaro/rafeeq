const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const {
  createSchool,
  getSchool,
  updateSchool,
  addTeacher,
  getTeachers,
  updateTeacher,
  deactivateTeacher,
  getSchoolStats,
} = require("../controllers/schoolController");

router.post("/", auth, isAdmin, createSchool);
router.get("/stats", auth, isAdmin, getSchoolStats);
router.get("/teachers", auth, isAdmin, getTeachers);
router.post("/teachers", auth, isAdmin, addTeacher);
router.put("/teachers/:id", auth, isAdmin, updateTeacher);
router.delete("/teachers/:id", auth, isAdmin, deactivateTeacher);
router.get("/:id", getSchool);
router.put("/:id", auth, isAdmin, updateSchool);

module.exports = router;
