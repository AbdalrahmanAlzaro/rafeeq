const { v4: uuidv4 } = require('uuid');
const {
  AssessmentQuestion, AssessmentQuestionAr, AssessmentQuestionEn,
  ChildAssessment, ChildAssessmentAnswer, ChildProfile, Teacher, Parent, User,
} = require('../models');
const { createNotification } = require('../utils/createNotification');
const { generateLearningTree } = require('../utils/generateTree');
const { LearningTree, TreeItem, Quiz, Homework, Activity, ChildScore } = require('../models');

const getQuestions = async (req, res) => {
  try {
    const { level, lang } = req.query;
    const where = {};
    if (level) where.level = parseInt(level);

    const questions = await AssessmentQuestion.findAll({ where });

    const LangModel = lang === 'en' ? AssessmentQuestionEn : AssessmentQuestionAr;
    const translations = await LangModel.findAll({
      where: { question_id: questions.map((q) => q.id) },
    });

    const translationMap = {};
    translations.forEach((t) => { translationMap[t.question_id] = t; });

    const result = questions.map((q) => ({
      id: q.id,
      level: q.level,
      order_num: q.order_num,
      correct_option: q.correct_option,
      translation: translationMap[q.id] || null,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const startAssessment = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const { child_id } = req.body;
    if (!child_id) return res.status(400).json({ message: 'child_id is required' });

    const child = await ChildProfile.findOne({ where: { id: child_id, teacher_id: teacher.id } });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const assessment = await ChildAssessment.create({
      id: uuidv4(),
      child_id,
      teacher_id: teacher.id,
      result_level: null,
    });

    res.status(201).json(assessment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const submitAssessment = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers array is required' });
    }

    const assessment = await ChildAssessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const child = await ChildProfile.findByPk(assessment.child_id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    let correctCount = 0;
    const answerRecords = [];

    for (const ans of answers) {
      const question = await AssessmentQuestion.findByPk(ans.question_id);
      if (!question) continue;

      const is_correct = question.correct_option === ans.selected_option;
      if (is_correct) correctCount++;

      answerRecords.push({
        id: uuidv4(),
        assessment_id: assessment.id,
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        is_correct,
        answered_at: new Date(),
      });
    }

    await ChildAssessmentAnswer.bulkCreate(answerRecords);

    const percentage = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;
    let result_level = 1;
    if (percentage > 70) result_level = 3;
    else if (percentage > 40) result_level = 2;

    await assessment.update({ result_level });
    await child.update({ level: result_level });

    // Generate AI learning tree
    try {
      const treeData = await generateLearningTree({
        child,
        level: result_level,
        topic: child.learning_difficulty,
      });

      const tree = await LearningTree.create({
        id: uuidv4(),
        child_id: child.id,
        level: result_level,
        topic: child.learning_difficulty,
        status: 'active',
      });

      const contentTypeMap = { quiz: 1, homework: 2, activity: 3 };

      for (const task of treeData.tasks) {
        const content_type_id = contentTypeMap[task.content_type] || 1;
        const item_id = uuidv4();
        const tree_item_id = uuidv4();

        if (task.content_type === 'quiz') {
          await Quiz.create({
            id: item_id,
            child_id: child.id,
            level: result_level,
            total_questions: 5,
            status: 'pending',
            tree_id: tree.id,
            tree_item_id,
          });
        } else if (task.content_type === 'homework') {
          await Homework.create({
            id: item_id,
            teacher_id: assessment.teacher_id,
            child_id: child.id,
            title_ar: task.title,
            description_ar: task.description,
            start_date: new Date(),
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            status: 'pending',
            tree_id: tree.id,
            tree_item_id,
          });
        } else if (task.content_type === 'activity') {
          await Activity.create({
            id: item_id,
            child_id: child.id,
            title: task.title,
            description: task.description,
            status: 'pending',
            tree_id: tree.id,
            tree_item_id,
          });
        }

        await TreeItem.create({
          id: tree_item_id,
          tree_id: tree.id,
          content_type_id,
          item_id,
          status: 'pending',
          order_num: task.order,
          max_points: 10,
        });
      }

      // Initialize child score for this tree
      await ChildScore.create({
        id: uuidv4(),
        child_id: child.id,
        tree_id: tree.id,
        total_score: 0,
        updated_at: new Date(),
      });

      // Notify parent
      if (child.parent_id) {
        const Parent = require('../models').Parent;
        const parent = await Parent.findByPk(child.parent_id);
        if (parent) {
          await createNotification(
            parent.user_id,
            'tree_ready',
            'شجرة التعلم جاهزة',
            'Learning Tree Ready',
            `تم إعداد شجرة تعلم جديدة لـ ${child.full_name_ar}`,
            `A new learning tree has been prepared for ${child.full_name_ar || child.full_name_en}`,
            tree.id
          );
        }
      }
    } catch (treeErr) {
      console.error('Tree generation error:', treeErr.message);
    }

    res.json({
      message: 'Assessment submitted',
      result_level,
      correct: correctCount,
      total: answers.length,
      percentage: Math.round(percentage),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAssessmentResult = async (req, res) => {
  try {
    const assessment = await ChildAssessment.findByPk(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const answers = await ChildAssessmentAnswer.findAll({
      where: { assessment_id: assessment.id },
    });

    res.json({ assessment, answers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getQuestions, startAssessment, submitAssessment, getAssessmentResult };
