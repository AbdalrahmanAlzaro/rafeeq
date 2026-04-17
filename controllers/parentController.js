const { Parent, ChildProfile, LearningTree, ChildScore } = require('../models');

const getMyProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ where: { user_id: req.user.id } });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });
    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ where: { user_id: req.user.id } });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const { full_name_ar, full_name_en } = req.body;
    await parent.update({
      full_name_ar: full_name_ar ?? parent.full_name_ar,
      full_name_en: full_name_en ?? parent.full_name_en,
    });

    res.json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getMyChildren = async (req, res) => {
  try {
    const parent = await Parent.findOne({ where: { user_id: req.user.id } });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const children = await ChildProfile.findAll({ where: { parent_id: parent.id } });
    res.json(children);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getChildDetail = async (req, res) => {
  try {
    const parent = await Parent.findOne({ where: { user_id: req.user.id } });
    if (!parent) return res.status(404).json({ message: 'Parent not found' });

    const child = await ChildProfile.findOne({
      where: { id: req.params.child_id, parent_id: parent.id },
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
