const {
  Exam,
  LearningTree,
  TreeTask,
  QuestionBank,
  Subject,
  SubjectLevel,
  Child,
  User,
  Notification,
} = require("../models");
const calcScore = require("../utils/calcScore");
const { generateLearningTree } = require("../utils/generateTree");

const createExam = async (req, res) => {
  try {
    const { child_id, subject_id, title_en, title_ar, question_ids } = req.body;

    if (!child_id || !subject_id || !title_en || !question_ids) {
      return res.status(400).json({
        message: "child_id, subject_id, title_en and question_ids are required",
      });
    }

    if (!Array.isArray(question_ids) || question_ids.length === 0) {
      return res
        .status(400)
        .json({ message: "question_ids must be a non-empty array" });
    }

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
    });
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (child.teacher_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You can only create exams for your own students" });
    }

    const subject = await Subject.findByPk(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const questions = await QuestionBank.findAll({
      where: { id: question_ids, subject_id },
    });

    if (questions.length !== question_ids.length) {
      return res.status(400).json({
        message:
          "Some question IDs are invalid or do not belong to this subject",
      });
    }

    const existingExam = await Exam.findOne({
      where: {
        child_id,
        subject_id,
        status: ["pending", "in_progress"],
      },
    });

    if (existingExam) {
      return res.status(409).json({
        message: "Child already has an active exam for this subject",
      });
    }

    const exam = await Exam.create({
      teacher_user_id: req.user.id,
      child_id,
      subject_id,
      title_en,
      title_ar: title_ar || null,
      question_ids,
      status: "pending",
      assigned_at: new Date(),
    });

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "New Exam Assigned",
      title_ar: "تم تعيين امتحان جديد",
      body_en: `A new ${subject.name_en} exam has been assigned to ${child.name_en}.`,
      body_ar: `تم تعيين امتحان ${subject.name_ar} جديد لـ ${child.name_ar}.`,
      type: "quiz",
      is_read: false,
    });

    return res.status(201).json({
      message: "Exam created and assigned successfully",
      exam,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getChildExam = async (req, res) => {
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

    const exams = await Exam.findAll({
      where: { child_id },
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: exams.length,
      exams,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
        {
          model: Child,
          attributes: ["id", "name_en", "name_ar", "special_need_type"],
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const child = await Child.findByPk(exam.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = exam.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const questions = await QuestionBank.findAll({
      where: { id: exam.question_ids },
      attributes: [
        "id",
        "question_text_en",
        "question_text_ar",
        "options",
        "difficulty",
        "points",
      ],
    });

    return res.status(200).json({
      exam: {
        ...exam.toJSON(),
        questions,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const startExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.status !== "pending") {
      return res.status(400).json({
        message: `Exam cannot be started. Current status: ${exam.status}`,
      });
    }

    const child = await Child.findByPk(exam.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = exam.teacher_user_id === req.user.id;

    if (!isParent && !isTeacher) {
      return res.status(403).json({ message: "Access denied" });
    }

    await exam.update({ status: "in_progress" });

    const questions = await QuestionBank.findAll({
      where: { id: exam.question_ids },
      attributes: [
        "id",
        "question_text_en",
        "question_text_ar",
        "options",
        "difficulty",
        "points",
      ],
    });

    return res.status(200).json({
      message: "Exam started",
      exam: {
        ...exam.toJSON(),
        questions,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const submitExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.status !== "in_progress") {
      return res.status(400).json({
        message: `Exam cannot be submitted. Current status: ${exam.status}`,
      });
    }

    const child = await Child.findByPk(exam.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = exam.teacher_user_id === req.user.id;

    if (!isParent && !isTeacher) {
      return res.status(403).json({ message: "Access denied" });
    }

    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: "answers array is required" });
    }

    const questions = await QuestionBank.findAll({
      where: { id: exam.question_ids },
    });

    const result = calcScore(questions, answers);

    await exam.update({
      status: "completed",
      completed_at: new Date(),
      score: result.score,
      total_marks: result.total_marks,
      percentage: result.percentage,
      answers: result.answers,
    });

    triggerTreeGeneration(exam, child, result.percentage);

    return res.status(200).json({
      message: "Exam submitted successfully",
      result: {
        score: result.score,
        total_marks: result.total_marks,
        percentage: result.percentage,
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

const triggerTreeGeneration = async (exam, child, percentage) => {
  try {
    const subject = await Subject.findByPk(exam.subject_id);

    let levelNumber = 1;
    if (percentage >= 80) levelNumber = 4;
    else if (percentage >= 65) levelNumber = 3;
    else if (percentage >= 50) levelNumber = 2;
    else levelNumber = 1;

    let level = await SubjectLevel.findOne({
      where: { subject_id: exam.subject_id, level_number: levelNumber },
    });

    if (!level) {
      level = await SubjectLevel.findOne({
        where: { subject_id: exam.subject_id },
        order: [["level_number", "ASC"]],
      });
    }

    if (!level) return;

    const tree = await LearningTree.create({
      child_id: child.id,
      exam_id: exam.id,
      subject_id: exam.subject_id,
      subject_level_id: level.id,
      current_level: level.level_number,
      status: "generating",
    });

    const availableQuestions = await QuestionBank.findAll({
      where: {
        subject_id: exam.subject_id,
        subject_level_id: level.id,
      },
      attributes: ["id"],
    });

    const questionIds = availableQuestions.map((q) => q.id);

    const aiResult = await generateLearningTree({
      child,
      subject,
      level,
      percentage,
      questionIds,
    });

    await tree.update({
      status: "active",
      ai_summary_en: aiResult.ai_summary_en,
      ai_summary_ar: aiResult.ai_summary_ar,
      generated_at: new Date(),
    });

    for (const task of aiResult.tasks) {
      await TreeTask.create({
        learning_tree_id: tree.id,
        order: task.order,
        type: task.type,
        status: task.order === 1 ? "in_progress" : "locked",
        title_en: task.title_en,
        title_ar: task.title_ar || null,
        instructions_en: task.instructions_en || null,
        instructions_ar: task.instructions_ar || null,
        expected_outcome_en: task.expected_outcome_en || null,
        expected_outcome_ar: task.expected_outcome_ar || null,
        materials_needed_en: task.materials_needed_en || null,
        materials_needed_ar: task.materials_needed_ar || null,
        passing_score: task.passing_score || 60,
        question_ids: task.question_ids || null,
        done_by_parent: false,
        confirmed_by_teacher: false,
        passed: false,
        attempt_count: 0,
      });
    }

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "Learning Tree Ready",
      title_ar: "شجرة التعلم جاهزة",
      body_en: `${child.name_en}'s personalized learning tree for ${subject.name_en} is ready. Check it out now!`,
      body_ar: `شجرة التعلم المخصصة لـ ${child.name_ar} في مادة ${subject.name_ar} جاهزة. تحقق منها الآن!`,
      type: "tree_ready",
      is_read: false,
    });
  } catch (err) {
    console.error("Tree generation error:", err);
  }
};

const getExamResult = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id, {
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
      ],
    });

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.status !== "completed") {
      return res.status(400).json({ message: "Exam is not completed yet" });
    }

    const child = await Child.findByPk(exam.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = exam.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    const tree = await LearningTree.findOne({
      where: { exam_id: exam.id },
      attributes: [
        "id",
        "status",
        "current_level",
        "ai_summary_en",
        "ai_summary_ar",
      ],
    });

    return res.status(200).json({
      result: {
        exam_id: exam.id,
        subject: exam.Subject,
        score: exam.score,
        total_marks: exam.total_marks,
        percentage: exam.percentage,
        completed_at: exam.completed_at,
        answers: exam.answers,
        learning_tree: tree || null,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createExam,
  getChildExam,
  getExam,
  startExam,
  submitExam,
  getExamResult,
};
