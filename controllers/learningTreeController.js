const {
  LearningTree,
  TreeTask,
  Subject,
  SubjectLevel,
  Child,
  QuestionBank,
  Notification,
} = require("../models");

const getChildTree = async (req, res) => {
  try {
    const { child_id } = req.params;

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const trees = await LearningTree.findAll({
      where: { child_id },
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
        {
          model: SubjectLevel,
          attributes: ["id", "level_number", "title_en", "title_ar"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: trees.length,
      trees,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTree = async (req, res) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id, {
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
        {
          model: SubjectLevel,
          attributes: [
            "id",
            "level_number",
            "title_en",
            "title_ar",
            "description_en",
            "description_ar",
          ],
        },
        {
          model: TreeTask,
          order: [["order", "ASC"]],
        },
      ],
    });

    if (!tree) {
      return res.status(404).json({ message: "Learning tree not found" });
    }

    const child = await Child.findByPk(tree.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const completedTasks = tree.TreeTasks.filter(
      (t) => t.status === "completed",
    ).length;
    const totalTasks = tree.TreeTasks.length;
    const progressPercentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return res.status(200).json({
      tree: {
        ...tree.toJSON(),
        progress: {
          completed: completedTasks,
          total: totalTasks,
          percentage: progressPercentage,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTreeTasks = async (req, res) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id);

    if (!tree) {
      return res.status(404).json({ message: "Learning tree not found" });
    }

    const child = await Child.findByPk(tree.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tasks = await TreeTask.findAll({
      where: { learning_tree_id: tree.id },
      order: [["order", "ASC"]],
    });

    return res.status(200).json({
      total: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await TreeTask.findByPk(req.params.task_id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const tree = await LearningTree.findByPk(task.learning_tree_id);
    const child = await Child.findByPk(tree.child_id);

    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    let questions = [];
    if (
      task.type === "quiz" &&
      task.question_ids &&
      task.question_ids.length > 0
    ) {
      questions = await QuestionBank.findAll({
        where: { id: task.question_ids },
        attributes: [
          "id",
          "question_text_en",
          "question_text_ar",
          "options",
          "difficulty",
          "points",
        ],
      });
    }

    return res.status(200).json({
      task: {
        ...task.toJSON(),
        questions: task.type === "quiz" ? questions : [],
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const markTaskDone = async (req, res) => {
  try {
    const task = await TreeTask.findByPk(req.params.task_id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status === "locked") {
      return res.status(400).json({ message: "Task is still locked" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ message: "Task is already completed" });
    }

    if (task.type === "quiz") {
      return res
        .status(400)
        .json({ message: "Quiz tasks are completed by submitting answers" });
    }

    const tree = await LearningTree.findByPk(task.learning_tree_id);
    const child = await Child.findByPk(tree.child_id);

    if (child.parent_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the parent can mark tasks as done" });
    }

    await task.update({ done_by_parent: true });

    if (task.confirmed_by_teacher) {
      await completeTask(task, tree, child);
    } else {
      const teacher = await Child.findByPk(tree.child_id);
      if (child.teacher_user_id) {
        await Notification.create({
          user_id: child.teacher_user_id,
          title_en: "Task Ready for Confirmation",
          title_ar: "المهمة جاهزة للتأكيد",
          body_en: `${child.name_en}'s parent marked "${task.title_en}" as done. Please review and confirm.`,
          body_ar: `ولي أمر ${child.name_ar} وضع علامة على "${task.title_ar}" كمكتملة. يرجى المراجعة والتأكيد.`,
          type: "task_confirmed",
          is_read: false,
        });
      }
    }

    return res.status(200).json({
      message: "Task marked as done by parent",
      task,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const confirmTask = async (req, res) => {
  try {
    const task = await TreeTask.findByPk(req.params.task_id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status === "locked") {
      return res.status(400).json({ message: "Task is still locked" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ message: "Task is already completed" });
    }

    if (task.type === "quiz") {
      return res
        .status(400)
        .json({ message: "Quiz tasks are completed automatically" });
    }

    const tree = await LearningTree.findByPk(task.learning_tree_id);
    const child = await Child.findByPk(tree.child_id);

    if (child.teacher_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the assigned teacher can confirm tasks" });
    }

    const { teacher_notes_en, teacher_notes_ar } = req.body;

    await task.update({
      confirmed_by_teacher: true,
      confirmed_at: new Date(),
      teacher_notes_en: teacher_notes_en || null,
      teacher_notes_ar: teacher_notes_ar || null,
    });

    if (task.done_by_parent) {
      await completeTask(task, tree, child);
    }

    return res.status(200).json({
      message: "Task confirmed by teacher",
      task,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const submitQuizAnswers = async (req, res) => {
  try {
    const task = await TreeTask.findByPk(req.params.task_id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.type !== "quiz") {
      return res.status(400).json({ message: "This task is not a quiz" });
    }

    if (task.status === "locked") {
      return res.status(400).json({ message: "Task is still locked" });
    }

    if (task.status === "completed") {
      return res.status(400).json({ message: "Quiz already completed" });
    }

    const tree = await LearningTree.findByPk(task.learning_tree_id);
    const child = await Child.findByPk(tree.child_id);

    if (child.parent_user_id !== req.user.id) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const questions = await QuestionBank.findAll({
      where: { id: task.question_ids },
    });

    const calcScore = require("../utils/calcScore");
    const result = calcScore(questions, answers);

    const passed = result.percentage >= (task.passing_score || 60);
    const attemptCount = (task.attempt_count || 0) + 1;

    await task.update({
      answers: result.answers,
      score: result.score,
      percentage: result.percentage,
      passed,
      attempt_count: attemptCount,
    });

    if (passed) {
      await completeTask(task, tree, child);
    }

    return res.status(200).json({
      message: passed ? "Quiz passed!" : "Quiz not passed. You can try again.",
      result: {
        score: result.score,
        total_marks: result.total_marks,
        percentage: result.percentage,
        passed,
        attempt_count: attemptCount,
        passing_score: task.passing_score,
        answers: result.answers,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const completeTask = async (task, tree, child) => {
  await task.update({
    status: "completed",
    completed_at: new Date(),
  });

  const nextTask = await TreeTask.findOne({
    where: {
      learning_tree_id: tree.id,
      order: task.order + 1,
      status: "locked",
    },
  });

  if (nextTask) {
    await nextTask.update({ status: "in_progress" });
  } else {
    await tree.update({ status: "completed" });

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "Learning Tree Completed!",
      title_ar: "اكتملت شجرة التعلم!",
      body_en: `${child.name_en} has completed all tasks in the current learning tree. A new level is being prepared!`,
      body_ar: `أكمل ${child.name_ar} جميع المهام في شجرة التعلم الحالية. يتم الآن إعداد مستوى جديد!`,
      type: "tree_ready",
      is_read: false,
    });
  }

  await Notification.create({
    user_id: child.parent_user_id,
    title_en: "Task Completed",
    title_ar: "تم إكمال المهمة",
    body_en: `"${task.title_en}" has been completed successfully!`,
    body_ar: `تم إكمال "${task.title_ar}" بنجاح!`,
    type: "task_confirmed",
    is_read: false,
  });
};

module.exports = {
  getChildTree,
  getTree,
  getTreeTasks,
  getTask,
  markTaskDone,
  confirmTask,
  submitQuizAnswers,
};
