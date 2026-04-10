const { User, School, Child } = require("../models");
const { Notification } = require("../models");

const addChild = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      date_of_birth,
      national_id,
      special_need_type,
      school_id,
    } = req.body;

    if (!name_en) {
      return res
        .status(400)
        .json({ message: "Child name in English is required" });
    }

    if (req.user.role !== "parent") {
      return res.status(403).json({ message: "Only parents can add children" });
    }

    if (national_id) {
      const existing = await Child.findOne({ where: { national_id } });
      if (existing) {
        return res
          .status(409)
          .json({ message: "National ID already registered" });
      }
    }

    const child = await Child.create({
      parent_user_id: req.user.id,
      teacher_user_id: null,
      school_id: school_id || null,
      name_en,
      name_ar: name_ar || null,
      date_of_birth: date_of_birth || null,
      national_id: national_id || null,
      special_need_type: special_need_type || null,
      is_active: true,
      behavioral_notes_en: null,
      behavioral_notes_ar: null,
      communication_notes_en: null,
      communication_notes_ar: null,
      social_notes_en: null,
      social_notes_ar: null,
      attention_notes_en: null,
      attention_notes_ar: null,
      additional_notes_en: null,
      additional_notes_ar: null,
    });

    return res.status(201).json({
      message: "Child added successfully",
      child,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyChildren = async (req, res) => {
  try {
    const children = await Child.findAll({
      where: {
        parent_user_id: req.user.id,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "Teacher",
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "phone",
            "grade_en",
            "grade_ar",
            "section_en",
            "section_ar",
            "avatar_url",
          ],
          required: false,
        },
        {
          model: School,
          attributes: ["id", "name_en", "name_ar", "logo_url"],
          required: false,
        },
      ],
    });

    return res.status(200).json({
      total: children.length,
      children,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: {
        id: req.params.id,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "Teacher",
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "phone",
            "grade_en",
            "grade_ar",
            "section_en",
            "section_ar",
            "avatar_url",
          ],
          required: false,
        },
        {
          model: User,
          as: "Parent",
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "phone",
            "email",
            "avatar_url",
          ],
          required: false,
        },
        {
          model: School,
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "logo_url",
            "location_en",
            "location_ar",
          ],
          required: false,
        },
      ],
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = child.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ child });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (child.parent_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the parent can update child info" });
    }

    const { name_en, name_ar, date_of_birth, special_need_type, school_id } =
      req.body;

    await child.update({
      name_en: name_en || child.name_en,
      name_ar: name_ar !== undefined ? name_ar : child.name_ar,
      date_of_birth:
        date_of_birth !== undefined ? date_of_birth : child.date_of_birth,
      special_need_type:
        special_need_type !== undefined
          ? special_need_type
          : child.special_need_type,
      school_id: school_id !== undefined ? school_id : child.school_id,
    });

    return res.status(200).json({
      message: "Child updated successfully",
      child,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateNotes = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (child.teacher_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the assigned teacher can update notes" });
    }

    const {
      behavioral_notes_en,
      behavioral_notes_ar,
      communication_notes_en,
      communication_notes_ar,
      social_notes_en,
      social_notes_ar,
      attention_notes_en,
      attention_notes_ar,
      additional_notes_en,
      additional_notes_ar,
    } = req.body;

    await child.update({
      behavioral_notes_en:
        behavioral_notes_en !== undefined
          ? behavioral_notes_en
          : child.behavioral_notes_en,
      behavioral_notes_ar:
        behavioral_notes_ar !== undefined
          ? behavioral_notes_ar
          : child.behavioral_notes_ar,
      communication_notes_en:
        communication_notes_en !== undefined
          ? communication_notes_en
          : child.communication_notes_en,
      communication_notes_ar:
        communication_notes_ar !== undefined
          ? communication_notes_ar
          : child.communication_notes_ar,
      social_notes_en:
        social_notes_en !== undefined ? social_notes_en : child.social_notes_en,
      social_notes_ar:
        social_notes_ar !== undefined ? social_notes_ar : child.social_notes_ar,
      attention_notes_en:
        attention_notes_en !== undefined
          ? attention_notes_en
          : child.attention_notes_en,
      attention_notes_ar:
        attention_notes_ar !== undefined
          ? attention_notes_ar
          : child.attention_notes_ar,
      additional_notes_en:
        additional_notes_en !== undefined
          ? additional_notes_en
          : child.additional_notes_en,
      additional_notes_ar:
        additional_notes_ar !== undefined
          ? additional_notes_ar
          : child.additional_notes_ar,
    });

    return res.status(200).json({
      message: "Child notes updated successfully",
      notes: {
        behavioral_notes_en: child.behavioral_notes_en,
        behavioral_notes_ar: child.behavioral_notes_ar,
        communication_notes_en: child.communication_notes_en,
        communication_notes_ar: child.communication_notes_ar,
        social_notes_en: child.social_notes_en,
        social_notes_ar: child.social_notes_ar,
        attention_notes_en: child.attention_notes_en,
        attention_notes_ar: child.attention_notes_ar,
        additional_notes_en: child.additional_notes_en,
        additional_notes_ar: child.additional_notes_ar,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const assignTeacher = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (req.user.role !== "school_admin") {
      return res
        .status(403)
        .json({ message: "Only school admins can assign teachers" });
    }

    const { teacher_user_id } = req.body;

    if (!teacher_user_id) {
      return res.status(400).json({ message: "teacher_user_id is required" });
    }

    const teacher = await User.findOne({
      where: {
        id: teacher_user_id,
        role: "teacher",
        school_id: req.user.school_id,
        is_active: true,
      },
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found in your school" });
    }

    await child.update({ teacher_user_id, school_id: req.user.school_id });

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "Teacher Assigned",
      title_ar: "تم تعيين المعلم",
      body_en: `${teacher.name_en} has been assigned as ${child.name_en}'s teacher.`,
      body_ar: `تم تعيين ${teacher.name_ar} معلماً لـ ${child.name_ar}.`,
      type: "announcement",
      is_read: false,
    });

    return res.status(200).json({
      message: "Teacher assigned successfully",
      child: {
        id: child.id,
        name_en: child.name_en,
        teacher_user_id: child.teacher_user_id,
        school_id: child.school_id,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTeacherStudents = async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this" });
    }

    const students = await Child.findAll({
      where: {
        teacher_user_id: req.user.id,
        is_active: true,
      },
      include: [
        {
          model: User,
          as: "Parent",
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "phone",
            "email",
            "avatar_url",
          ],
          required: false,
        },
        {
          model: School,
          attributes: ["id", "name_en", "name_ar"],
          required: false,
        },
      ],
    });

    return res.status(200).json({
      total: students.length,
      students,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deactivateChild = async (req, res) => {
  try {
    const child = await Child.findOne({
      where: { id: req.params.id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (
      child.parent_user_id !== req.user.id &&
      req.user.role !== "school_admin"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await child.update({ is_active: false });

    return res.status(200).json({ message: "Child deactivated successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  addChild,
  getMyChildren,
  getChild,
  updateChild,
  updateNotes,
  assignTeacher,
  getTeacherStudents,
  deactivateChild,
};
