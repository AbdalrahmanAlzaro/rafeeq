const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getChildTree,
  getTree,
  getTreeTasks,
  getTask,
  markTaskDone,
  confirmTask,
  submitQuizAnswers,
} = require("../controllers/learningTreeController");

router.get("/child/:child_id", auth, getChildTree);
router.get("/:id", auth, getTree);
router.get("/:id/tasks", auth, getTreeTasks);
router.get("/:id/tasks/:task_id", auth, getTask);
router.put("/:id/tasks/:task_id/done", auth, markTaskDone);
router.put("/:id/tasks/:task_id/confirm", auth, confirmTask);
router.post("/:id/tasks/:task_id/quiz/submit", auth, submitQuizAnswers);

module.exports = router;
