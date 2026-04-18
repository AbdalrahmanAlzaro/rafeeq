const { v4: uuidv4 } = require('uuid');
const { Subject, Topic } = require('../models');

const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({ order: [['name_ar', 'ASC']] });
    res.json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createSubject = async (req, res) => {
  try {
    const { name_ar, name_en } = req.body;
    if (!name_ar) return res.status(400).json({ message: 'name_ar is required' });

    const subject = await Subject.create({ id: uuidv4(), name_ar, name_en: name_en || null });
    res.status(201).json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTopicsBySubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const topics = await Topic.findAll({
      where: { subject_id: subject.id },
      order: [['level', 'ASC']],
    });
    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const createTopic = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const { name_ar, name_en, level } = req.body;
    if (!name_ar || !level) return res.status(400).json({ message: 'name_ar and level are required' });

    const topic = await Topic.create({
      id: uuidv4(),
      subject_id: subject.id,
      name_ar,
      name_en: name_en || null,
      level,
    });
    res.status(201).json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { getSubjects, createSubject, getTopicsBySubject, createTopic };
