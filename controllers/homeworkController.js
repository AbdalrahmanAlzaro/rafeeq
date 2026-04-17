const { v4: uuidv4 } = require('uuid');
const {
  Homework, ChildProfile, TreeItem, ChildScore, ChildScoreLog, Teacher, Parent, User,
} = require('../models');
const { createNotification } = require('../utils/createNotification');

const getHomework = async (req, res) => {
  try {
    const homework = await Homework.findByPk(req.params.id);
    if (!homework) return res.status(404).json({ message: 'Homework not found' });
    res.json(homework);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const submitHomework = async (req, res) => {
  try {
    const { child_file_url } = req.body;
    if (!child_file_url) return res.status(400).json({ message: 'child_file_url is required' });

    const homework = await Homework.findByPk(req.params.id);
    if (!homework) return res.status(404).json({ message: 'Homework not found' });
    if (homework.status === 'submitted') {
      return res.status(400).json({ message: 'Homework already submitted' });
    }

    await homework.update({
      child_file_url,
      status: 'submitted',
      submitted_at: new Date(),
    });

    // Notify teacher
    const teacher = await Teacher.findByPk(homework.teacher_id);
    if (teacher) {
      await createNotification(
        teacher.user_id,
        'homework_submitted',
        'تم تسليم الواجب',
        'Homework Submitted',
        `تم تسليم واجب: ${homework.title_ar}`,
        `Homework submitted: ${homework.title_en || homework.title_ar}`,
        homework.id
      );
    }

    res.json({ message: 'Homework submitted', homework });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const approveHomework = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const homework = await Homework.findOne({
      where: { id: req.params.id, teacher_id: teacher.id },
    });
    if (!homework) return res.status(404).json({ message: 'Homework not found' });
    if (homework.status !== 'submitted') {
      return res.status(400).json({ message: 'Homework not yet submitted' });
    }

    const { earned_points } = req.body;
    const MAX_POINTS = 10;
    const points = earned_points !== undefined ? earned_points : MAX_POINTS;

    const child = await ChildProfile.findByPk(homework.child_id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const treeItem = await TreeItem.findOne({ where: { item_id: homework.id, content_type_id: 2 } });
    if (treeItem) {
      await treeItem.update({ status: 'completed' });

      await ChildScoreLog.create({
        id: uuidv4(),
        child_id: child.id,
        tree_id: treeItem.tree_id,
        content_type_id: 2,
        item_id: homework.id,
        max_points: MAX_POINTS,
        earned_points: points,
        submitted_at: new Date(),
      });

      let scoreRecord = await ChildScore.findOne({
        where: { child_id: child.id, tree_id: treeItem.tree_id },
      });
      if (scoreRecord) {
        await scoreRecord.update({ total_score: scoreRecord.total_score + points });
      } else {
        await ChildScore.create({
          id: uuidv4(), child_id: child.id,
          tree_id: treeItem.tree_id, total_score: points,
        });
      }
    }

    res.json({ message: 'Homework approved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getHomework, submitHomework, approveHomework };
