const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");
const {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
  addLevel,
  getLevels,
  getLevel,
  updateLevel,
  deleteLevel,
} = require("../controllers/subjectController");

router.get("/", getAllSubjects);
router.get("/:id", getSubject);
router.post("/", auth, isAdmin, createSubject);
router.put("/:id", auth, isAdmin, updateSubject);
router.delete("/:id", auth, isAdmin, deleteSubject);

router.get("/:id/levels", getLevels);
router.get("/:id/levels/:level_id", getLevel);
router.post("/:id/levels", auth, isAdmin, addLevel);
router.put("/:id/levels/:level_id", auth, isAdmin, updateLevel);
router.delete("/:id/levels/:level_id", auth, isAdmin, deleteLevel);

module.exports = router;
