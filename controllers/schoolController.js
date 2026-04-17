const { School, Teacher, ChildProfile } = require('../models');

const getMySchool = async (req, res) => {
  try {
    const school = await School.findOne({ where: { user_id: req.user.id } });
    if (!school) return res.status(404).json({ message: 'School not found' });
    res.json(school);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await School.findOne({ where: { user_id: req.user.id } });
    if (!school) return res.status(404).json({ message: 'School not found' });

    const { name_ar, name_en, location, description, contact_phone } = req.body;
    await school.update({
      name_ar: name_ar ?? school.name_ar,
      name_en: name_en ?? school.name_en,
      location: location ?? school.location,
      description: description ?? school.description,
      contact_phone: contact_phone ?? school.contact_phone,
    });

    res.json(school);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    const school = await School.findOne({ where: { user_id: req.user.id } });
    if (!school) return res.status(404).json({ message: 'School not found' });

    const teachers = await Teacher.findAll({ where: { school_id: school.id } });
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStats = async (req, res) => {
  try {
    const school = await School.findOne({ where: { user_id: req.user.id } });
    if (!school) return res.status(404).json({ message: 'School not found' });

    const teacherCount = await Teacher.count({ where: { school_id: school.id } });

    const teachers = await Teacher.findAll({ where: { school_id: school.id }, attributes: ['id'] });
    const teacherIds = teachers.map((t) => t.id);
    const childCount = teacherIds.length
      ? await ChildProfile.count({ where: { teacher_id: teacherIds } })
      : 0;

    res.json({ total_teachers: teacherCount, total_children: childCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getMySchool, updateSchool, getTeachers, getStats };
