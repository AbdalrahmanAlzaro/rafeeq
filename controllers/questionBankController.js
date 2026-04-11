const { QuestionBank, Subject, SubjectLevel } = require("../models");

const addQuestion = async (req, res) => {
  try {
    const {
      subject_id,
      subject_level_id,
      question_text_en,
      question_text_ar,
      options,
      correct_answer,
      difficulty,
      points,
    } = req.body;

    if (
      !subject_id ||
      !subject_level_id ||
      !question_text_en ||
      !options ||
      !correct_answer
    ) {
      return res.status(400).json({
        message:
          "subject_id, subject_level_id, question_text_en, options and correct_answer are required",
      });
    }

    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        message: "options must be an array with at least 2 choices",
      });
    }

    const validKeys = options.map((o) => o.label);
    if (!validKeys.includes(correct_answer)) {
      return res.status(400).json({
        message: "correct_answer must match one of the option labels",
      });
    }

    const subject = await Subject.findByPk(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const level = await SubjectLevel.findOne({
      where: { id: subject_level_id, subject_id },
    });
    if (!level) {
      return res
        .status(404)
        .json({ message: "Level not found for this subject" });
    }

    const question = await QuestionBank.create({
      subject_id,
      subject_level_id,
      teacher_user_id: null,
      question_text_en,
      question_text_ar: question_text_ar || null,
      options,
      correct_answer,
      difficulty: difficulty || "medium",
      points: points || 1,
    });

    return res.status(201).json({
      message: "Question added successfully",
      question,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getQuestions = async (req, res) => {
  try {
    const { subject_id, subject_level_id, difficulty } = req.query;

    const where = {};

    if (subject_id) where.subject_id = subject_id;
    if (subject_level_id) where.subject_level_id = subject_level_id;
    if (difficulty) where.difficulty = difficulty;

    const questions = await QuestionBank.findAll({
      where,
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
      total: questions.length,
      questions,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id, {
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
    });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json({ question });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const {
      question_text_en,
      question_text_ar,
      options,
      correct_answer,
      difficulty,
      points,
      subject_level_id,
    } = req.body;

    if (options && !Array.isArray(options)) {
      return res.status(400).json({ message: "options must be an array" });
    }

    if (options && options.length < 2) {
      return res
        .status(400)
        .json({ message: "options must have at least 2 choices" });
    }

    const finalOptions = options || question.options;
    const finalCorrectAnswer = correct_answer || question.correct_answer;
    const validKeys = finalOptions.map((o) => o.label);

    if (!validKeys.includes(finalCorrectAnswer)) {
      return res.status(400).json({
        message: "correct_answer must match one of the option labels",
      });
    }

    if (subject_level_id) {
      const level = await SubjectLevel.findOne({
        where: { id: subject_level_id, subject_id: question.subject_id },
      });
      if (!level) {
        return res
          .status(404)
          .json({ message: "Level not found for this subject" });
      }
    }

    await question.update({
      question_text_en: question_text_en || question.question_text_en,
      question_text_ar:
        question_text_ar !== undefined
          ? question_text_ar
          : question.question_text_ar,
      options: finalOptions,
      correct_answer: finalCorrectAnswer,
      difficulty: difficulty || question.difficulty,
      points: points !== undefined ? points : question.points,
      subject_level_id: subject_level_id || question.subject_level_id,
    });

    return res.status(200).json({
      message: "Question updated successfully",
      question,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await QuestionBank.findByPk(req.params.id);

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    await question.destroy();

    return res.status(200).json({ message: "Question deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getQuestionsBySubjectAndLevel = async (req, res) => {
  try {
    const { subject_id, level_id } = req.params;
    const { difficulty } = req.query;

    const subject = await Subject.findByPk(subject_id);
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const level = await SubjectLevel.findOne({
      where: { id: level_id, subject_id },
    });
    if (!level) {
      return res
        .status(404)
        .json({ message: "Level not found for this subject" });
    }

    const where = { subject_id, subject_level_id: level_id };
    if (difficulty) where.difficulty = difficulty;

    const questions = await QuestionBank.findAll({
      where,
      attributes: [
        "id",
        "question_text_en",
        "question_text_ar",
        "options",
        "correct_answer",
        "difficulty",
        "points",
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      subject_id: subject.id,
      subject_name_en: subject.name_en,
      subject_name_ar: subject.name_ar,
      level_id: level.id,
      level_number: level.level_number,
      level_title_en: level.title_en,
      level_title_ar: level.title_ar,
      total: questions.length,
      questions,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addQuestion,
  getQuestions,
  getQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionsBySubjectAndLevel,
};
