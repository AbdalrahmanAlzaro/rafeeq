const express = require("express");
const router = express.Router();
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

router.post("/", createSubject);
router.get("/", getAllSubjects);
router.get("/:id", getSubject);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

router.post("/:id/levels", addLevel);
router.get("/:id/levels", getLevels);
router.get("/:id/levels/:level_id", getLevel);
router.put("/:id/levels/:level_id", updateLevel);
router.delete("/:id/levels/:level_id", deleteLevel);

module.exports = router;
