const { v4: uuidv4 } = require('uuid');
const {
  Activity, ChildProfile, TreeItem, ChildScore, ChildScoreLog, Teacher,
} = require('../models');
const { createNotification } = require('../utils/createNotification');

const getActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    res.json(activity);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const completeActivity = async (req, res) => {
  try {
    const activity = await Activity.findByPk(req.params.id);
    if (!activity) return res.status(404).json({ message: 'Activity not found' });
    if (activity.status === 'completed') {
      return res.status(400).json({ message: 'Activity already completed' });
    }

    await activity.update({ status: 'completed', completed_at: new Date() });

    const child = await ChildProfile.findByPk(activity.child_id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const MAX_POINTS = 10;

    const treeItem = await TreeItem.findOne({ where: { item_id: activity.id, content_type_id: 3 } });
    if (treeItem) {
      await treeItem.update({ status: 'completed' });

      await ChildScoreLog.create({
        id: uuidv4(),
        child_id: child.id,
        tree_id: treeItem.tree_id,
        content_type_id: 3,
        item_id: activity.id,
        max_points: MAX_POINTS,
        earned_points: MAX_POINTS,
        submitted_at: new Date(),
      });

      let scoreRecord = await ChildScore.findOne({
        where: { child_id: child.id, tree_id: treeItem.tree_id },
      });
      if (scoreRecord) {
        await scoreRecord.update({ total_score: scoreRecord.total_score + MAX_POINTS });
      } else {
        await ChildScore.create({
          id: uuidv4(), child_id: child.id,
          tree_id: treeItem.tree_id, total_score: MAX_POINTS,
        });
      }
    }

    // Notify teacher
    const teacher = await Teacher.findByPk(child.teacher_id);
    if (teacher) {
      await createNotification(
        teacher.user_id,
        'activity_completed',
        'تم إكمال النشاط',
        'Activity Completed',
        `أكمل ${child.full_name_ar} النشاط: ${activity.title}`,
        `${child.full_name_ar || child.full_name_en} completed activity: ${activity.title}`,
        activity.id
      );
    }

    res.json({ message: 'Activity completed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getActivity, completeActivity };
