const { v4: uuidv4 } = require('uuid');
const {
  Quiz, QuizQuestion, QuizAnswer, ChildProfile, TreeItem,
  ChildScore, ChildScoreLog, Parent,
} = require('../models');
const { createNotification } = require('../utils/createNotification');

const getQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

    const questions = await QuizQuestion.findAll({
      where: { quiz_id: quiz.id },
      order: [['order_num', 'ASC']],
    });

    res.json({ quiz, questions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.status === 'completed') {
      return res.status(400).json({ message: 'Quiz already completed' });
    }

    await quiz.update({ started_at: new Date(), status: 'pending' });
    res.json({ message: 'Quiz started', quiz });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const submitQuiz = async (req, res) => {
  try {
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'answers array is required' });
    }

    const quiz = await Quiz.findByPk(req.params.id);
    if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
    if (quiz.status === 'completed') {
      return res.status(400).json({ message: 'Quiz already completed' });
    }

    const child = await ChildProfile.findByPk(quiz.child_id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    let correctCount = 0;
    const answerRecords = [];

    for (const ans of answers) {
      const question = await QuizQuestion.findOne({
        where: { id: ans.question_id, quiz_id: quiz.id },
      });
      if (!question) continue;

      const is_correct = question.correct_option === ans.selected_option;
      if (is_correct) correctCount++;

      answerRecords.push({
        id: uuidv4(),
        quiz_id: quiz.id,
        question_id: ans.question_id,
        selected_option: ans.selected_option,
        is_correct,
        answered_at: new Date(),
      });
    }

    await QuizAnswer.bulkCreate(answerRecords);

    const score = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0;
    await quiz.update({ score, status: 'completed', completed_at: new Date() });

    const earnedPoints = Math.round((correctCount / Math.max(answers.length, 1)) * 10);
    const MAX_POINTS = 10;

    // Find tree item for this quiz
    const treeItem = await TreeItem.findOne({ where: { item_id: quiz.id, content_type_id: 1 } });
    if (treeItem) {
      await treeItem.update({ status: 'completed' });

      await ChildScoreLog.create({
        id: uuidv4(),
        child_id: child.id,
        tree_id: treeItem.tree_id,
        content_type_id: 1,
        item_id: quiz.id,
        max_points: MAX_POINTS,
        earned_points: earnedPoints,
        submitted_at: new Date(),
      });

      let scoreRecord = await ChildScore.findOne({
        where: { child_id: child.id, tree_id: treeItem.tree_id },
      });
      if (scoreRecord) {
        await scoreRecord.update({ total_score: scoreRecord.total_score + earnedPoints });
      } else {
        await ChildScore.create({
          id: uuidv4(), child_id: child.id,
          tree_id: treeItem.tree_id, total_score: earnedPoints,
        });
      }
    }

    // Notify parent
    if (child.parent_id) {
      const parent = await Parent.findByPk(child.parent_id);
      if (parent) {
        await createNotification(
          parent.user_id,
          'quiz_completed',
          'تم إكمال الاختبار',
          'Quiz Completed',
          `أكمل ${child.full_name_ar} الاختبار بنتيجة ${score}%`,
          `${child.full_name_ar || child.full_name_en} completed a quiz with score ${score}%`,
          quiz.id
        );
      }
    }

    res.json({ message: 'Quiz submitted', score, correct: correctCount, total: answers.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getQuiz, startQuiz, submitQuiz };
