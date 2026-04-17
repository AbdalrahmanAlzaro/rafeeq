const { v4: uuidv4 } = require('uuid');
const {
  LearningTree, TreeItem, ChildScore, ChildScoreLog, ChildProfile,
  Quiz, Homework, Activity,
} = require('../models');
const { createNotification } = require('../utils/createNotification');
const { generateLearningTree } = require('../utils/generateTree');

const getChildTree = async (req, res) => {
  try {
    const child = await ChildProfile.findByPk(req.params.child_id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const tree = await LearningTree.findOne({
      where: { child_id: child.id, status: 'active' },
    });
    if (!tree) return res.status(404).json({ message: 'No active learning tree found' });

    const items = await TreeItem.findAll({
      where: { tree_id: tree.id },
      order: [['order_num', 'ASC']],
    });

    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let itemData = null;
        if (item.content_type_id === 1) {
          itemData = await Quiz.findByPk(item.item_id);
        } else if (item.content_type_id === 2) {
          itemData = await Homework.findByPk(item.item_id);
        } else if (item.content_type_id === 3) {
          itemData = await Activity.findByPk(item.item_id);
        }
        return { ...item.toJSON(), item_data: itemData };
      })
    );

    res.json({ tree, items: enrichedItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTreeProgress = async (req, res) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Tree not found' });

    const scores = await ChildScore.findAll({ where: { tree_id: tree.id } });
    const logs = await ChildScoreLog.findAll({ where: { tree_id: tree.id } });

    res.json({ tree, scores, logs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const completeTreeItem = async (req, res) => {
  try {
    const tree = await LearningTree.findByPk(req.params.id);
    if (!tree) return res.status(404).json({ message: 'Tree not found' });

    const treeItem = await TreeItem.findOne({
      where: { id: req.params.item_id, tree_id: tree.id },
    });
    if (!treeItem) return res.status(404).json({ message: 'Tree item not found' });

    const { earned_points, max_points, content_type_id } = req.body;

    await treeItem.update({
      status: 'completed',
      earned_points: earned_points || 0,
      max_points: max_points || treeItem.max_points || 10,
      completed_at: new Date(),
    });

    await ChildScoreLog.create({
      id: uuidv4(),
      child_id: tree.child_id,
      tree_id: tree.id,
      content_type_id: content_type_id || treeItem.content_type_id,
      item_id: treeItem.item_id,
      max_points: max_points || treeItem.max_points || 10,
      earned_points: earned_points || 0,
      submitted_at: new Date(),
    });

    let scoreRecord = await ChildScore.findOne({ where: { child_id: tree.child_id, tree_id: tree.id } });
    if (scoreRecord) {
      await scoreRecord.update({ total_score: scoreRecord.total_score + (earned_points || 0), updated_at: new Date() });
    } else {
      scoreRecord = await ChildScore.create({
        id: uuidv4(),
        child_id: tree.child_id,
        tree_id: tree.id,
        total_score: earned_points || 0,
        updated_at: new Date(),
      });
    }

    // Check if all items completed
    const allItems = await TreeItem.findAll({ where: { tree_id: tree.id } });
    const allDone = allItems.every((i) => i.status === 'completed');

    if (allDone) {
      await tree.update({ status: 'completed' });

      const child = await ChildProfile.findByPk(tree.child_id);
      if (child) {
        const nextLevel = Math.min(child.level + 1, 3);
        await child.update({ level: nextLevel });

        // Generate new tree for next level
        try {
          const treeData = await generateLearningTree({
            child,
            level: nextLevel,
            topic: child.learning_difficulty,
          });

          const newTree = await LearningTree.create({
            id: uuidv4(),
            child_id: child.id,
            level: nextLevel,
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
                id: item_id, child_id: child.id, level: nextLevel,
                total_questions: 5, status: 'pending',
                tree_id: newTree.id, tree_item_id,
              });
            } else if (task.content_type === 'homework') {
              await Homework.create({
                id: item_id, teacher_id: child.teacher_id, child_id: child.id,
                title_ar: task.title, description_ar: task.description,
                start_date: new Date(),
                due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                status: 'pending',
                tree_id: newTree.id, tree_item_id,
              });
            } else if (task.content_type === 'activity') {
              await Activity.create({
                id: item_id, child_id: child.id,
                title: task.title, description: task.description, status: 'pending',
                tree_id: newTree.id, tree_item_id,
              });
            }

            await TreeItem.create({
              id: tree_item_id, tree_id: newTree.id,
              content_type_id, item_id, status: 'pending', order_num: task.order, max_points: 10,
            });
          }

          await ChildScore.create({
            id: uuidv4(), child_id: child.id, tree_id: newTree.id, total_score: 0, updated_at: new Date(),
          });

          if (child.parent_id) {
            const Parent = require('../models').Parent;
            const parent = await Parent.findByPk(child.parent_id);
            if (parent) {
              await createNotification(
                parent.user_id, 'tree_ready',
                'شجرة تعلم جديدة',
                'New Learning Tree',
                `تم إعداد شجرة تعلم جديدة لـ ${child.full_name_ar} في المستوى ${nextLevel}`,
                `A new learning tree for level ${nextLevel} has been prepared for ${child.full_name_ar || child.full_name_en}`,
                newTree.id
              );
            }
          }
        } catch (treeErr) {
          console.error('Next tree generation error:', treeErr.message);
        }
      }
    }

    res.json({ message: 'Tree item completed', tree_completed: allDone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getChildTree, getTreeProgress, completeTreeItem };
