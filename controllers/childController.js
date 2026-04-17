const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { User, Teacher, Parent, ChildProfile, LearningTree, ChildScore, TreeItem } = require('../models');

const createChild = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const {
      full_name_ar, full_name_en, date_of_birth, gender,
      learning_difficulty, class_name, photo_url, parent_national_id,
      national_id, phone,
    } = req.body;

    if (!full_name_ar || !date_of_birth || !gender || !learning_difficulty || !class_name) {
      return res.status(400).json({ message: 'Missing required child fields' });
    }

    let parent = null;
    if (parent_national_id) {
      const parentUser = await User.findOne({ where: { national_id: parent_national_id, role: 'parent' } });
      if (parentUser) {
        parent = await Parent.findOne({ where: { user_id: parentUser.id } });
      }
    }

    const password_hash = await bcrypt.hash(uuidv4(), 10);
    const childUser = await User.create({
      id: uuidv4(),
      role: 'child',
      national_id: national_id || null,
      phone: phone || null,
      password_hash,
      language: 'ar',
    });

    const child = await ChildProfile.create({
      id: uuidv4(),
      user_id: childUser.id,
      parent_id: parent ? parent.id : null,
      teacher_id: teacher.id,
      full_name_ar,
      full_name_en: full_name_en || null,
      date_of_birth,
      gender,
      learning_difficulty,
      level: 1,
      class_name,
      photo_url: photo_url || null,
    });

    res.status(201).json({ message: 'Child created successfully', child, child_user_id: childUser.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateChild = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const child = await ChildProfile.findOne({
      where: { id: req.params.id, teacher_id: teacher.id },
    });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const {
      full_name_ar, full_name_en, date_of_birth, gender,
      learning_difficulty, class_name, photo_url, level,
    } = req.body;

    await child.update({
      full_name_ar: full_name_ar ?? child.full_name_ar,
      full_name_en: full_name_en ?? child.full_name_en,
      date_of_birth: date_of_birth ?? child.date_of_birth,
      gender: gender ?? child.gender,
      learning_difficulty: learning_difficulty ?? child.learning_difficulty,
      class_name: class_name ?? child.class_name,
      photo_url: photo_url ?? child.photo_url,
      level: level ?? child.level,
    });

    res.json(child);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getChildProgress = async (req, res) => {
  try {
    const child = await ChildProfile.findByPk(req.params.id);
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const scores = await ChildScore.findAll({ where: { child_id: child.id } });
    const trees = await LearningTree.findAll({ where: { child_id: child.id } });

    const treeIds = trees.map((t) => t.id);
    const treeItems = treeIds.length
      ? await TreeItem.findAll({ where: { tree_id: treeIds } })
      : [];

    const completedItems = treeItems.filter((i) => i.status === 'completed').length;
    const totalItems = treeItems.length;

    res.json({ child, scores, trees, completedItems, totalItems });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { createChild, updateChild, getChildProgress };
