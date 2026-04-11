const { Subject, SubjectLevel } = require("../models");

const createSubject = async (req, res) => {
  try {
    const { name_en, name_ar, description_en, description_ar, color_code } =
      req.body;

    if (!name_en) {
      return res
        .status(400)
        .json({ message: "Subject name in English is required" });
    }

    const existing = await Subject.findOne({ where: { name_en } });
    if (existing) {
      return res.status(409).json({ message: "Subject already exists" });
    }

    const subject = await Subject.create({
      name_en,
      name_ar: name_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
      color_code: color_code || null,
    });

    return res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      include: [
        {
          model: SubjectLevel,
          attributes: ["id", "level_number", "title_en", "title_ar"],
          required: false,
        },
      ],
      order: [["createdAt", "ASC"]],
    });

    return res.status(200).json({
      total: subjects.length,
      subjects,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id, {
      include: [
        {
          model: SubjectLevel,
          attributes: [
            "id",
            "level_number",
            "title_en",
            "title_ar",
            "description_en",
            "description_ar",
          ],
          required: false,
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    return res.status(200).json({ subject });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const { name_en, name_ar, description_en, description_ar, color_code } =
      req.body;

    await subject.update({
      name_en: name_en || subject.name_en,
      name_ar: name_ar !== undefined ? name_ar : subject.name_ar,
      description_en:
        description_en !== undefined ? description_en : subject.description_en,
      description_ar:
        description_ar !== undefined ? description_ar : subject.description_ar,
      color_code: color_code !== undefined ? color_code : subject.color_code,
    });

    return res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    await subject.destroy();

    return res.status(200).json({ message: "Subject deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addLevel = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const { level_number, title_en, title_ar, description_en, description_ar } =
      req.body;

    if (!level_number || !title_en) {
      return res
        .status(400)
        .json({ message: "level_number and title_en are required" });
    }

    const existing = await SubjectLevel.findOne({
      where: { subject_id: subject.id, level_number },
    });

    if (existing) {
      return res.status(409).json({
        message: `Level ${level_number} already exists for this subject`,
      });
    }

    const level = await SubjectLevel.create({
      subject_id: subject.id,
      level_number,
      title_en,
      title_ar: title_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
    });

    return res.status(201).json({
      message: "Level added successfully",
      level,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getLevels = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const levels = await SubjectLevel.findAll({
      where: { subject_id: subject.id },
      order: [["level_number", "ASC"]],
    });

    return res.status(200).json({
      subject_id: subject.id,
      subject_name_en: subject.name_en,
      subject_name_ar: subject.name_ar,
      total: levels.length,
      levels,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getLevel = async (req, res) => {
  try {
    const level = await SubjectLevel.findOne({
      where: {
        id: req.params.level_id,
        subject_id: req.params.id,
      },
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
        },
      ],
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    return res.status(200).json({ level });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateLevel = async (req, res) => {
  try {
    const level = await SubjectLevel.findOne({
      where: {
        id: req.params.level_id,
        subject_id: req.params.id,
      },
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    const { level_number, title_en, title_ar, description_en, description_ar } =
      req.body;

    if (level_number && level_number !== level.level_number) {
      const existing = await SubjectLevel.findOne({
        where: { subject_id: req.params.id, level_number },
      });
      if (existing) {
        return res.status(409).json({
          message: `Level ${level_number} already exists for this subject`,
        });
      }
    }

    await level.update({
      level_number:
        level_number !== undefined ? level_number : level.level_number,
      title_en: title_en || level.title_en,
      title_ar: title_ar !== undefined ? title_ar : level.title_ar,
      description_en:
        description_en !== undefined ? description_en : level.description_en,
      description_ar:
        description_ar !== undefined ? description_ar : level.description_ar,
    });

    return res.status(200).json({
      message: "Level updated successfully",
      level,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteLevel = async (req, res) => {
  try {
    const level = await SubjectLevel.findOne({
      where: {
        id: req.params.level_id,
        subject_id: req.params.id,
      },
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found" });
    }

    await level.destroy();

    return res.status(200).json({ message: "Level deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createSubject,
  getAllSubjects,
  getSubject,
  updateSubject,
  deleteSubject,
  addLevel,
  getLevels,
  getLevel,
  updateLevel,
  deleteLevel,
};
