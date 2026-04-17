const { Teacher, ChildProfile, User, LearningTree, ChildScore } = require('../models');

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

module.exports = { getMyProfile, updateProfile, getMyChildren, getChildDetail };
