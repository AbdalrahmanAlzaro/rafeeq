const { v4: uuidv4 } = require('uuid');
const { Teacher, ChildProfile, User, LearningTree, ChildScore, School } = require('../models');

const getMyProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const { full_name_ar, full_name_en, specialization } = req.body;
    await teacher.update({
      full_name_ar: full_name_ar ?? teacher.full_name_ar,
      full_name_en: full_name_en ?? teacher.full_name_en,
      specialization: specialization ?? teacher.specialization,
    });

    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyChildren = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const children = await ChildProfile.findAll({ where: { teacher_id: teacher.id } });
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getChildDetail = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });

    const child = await ChildProfile.findOne({
      where: { id: req.params.child_id, teacher_id: teacher.id },
    });
    if (!child) return res.status(404).json({ message: 'Child not found' });

    const scores = await ChildScore.findAll({ where: { child_id: child.id } });
    const trees = await LearningTree.findAll({ where: { child_id: child.id } });

    res.json({ child, scores, trees });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const completeProfile = async (req, res) => {
  try {
    const existing = await Teacher.findOne({ where: { user_id: req.user.id } });
    if (existing) return res.status(400).json({ message: 'Teacher profile already exists' });

    const { school_id, full_name_ar, full_name_en, specialization } = req.body;
    if (!school_id || !full_name_ar) {
      return res.status(400).json({ message: 'school_id and full_name_ar are required' });
    }

    let school = await School.findByPk(school_id);
    if (!school) school = await School.findOne({ where: { user_id: school_id } });
    if (!school) return res.status(404).json({ message: 'School not found' });

    const teacher = await Teacher.create({
      id: uuidv4(),
      user_id: req.user.id,
      school_id: school.id,
      full_name_ar,
      full_name_en: full_name_en || null,
      specialization: specialization || null,
    });

    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMyProfile, updateProfile, getMyChildren, getChildDetail, completeProfile };
