const bcrypt = require("bcryptjs");
const { User, School, Child } = require("../models");
const { generateOTP, getOTPExpiry, sendOTP } = require("../utils/sendOTP");

const createSchool = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      location_en,
      location_ar,
      logo_url,
      contact_email,
      contact_phone,
    } = req.body;

    if (!name_en) {
      return res
        .status(400)
        .json({ message: "School name in English is required" });
    }

    const school = await School.create({
      name_en,
      name_ar: name_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
      location_en: location_en || null,
      location_ar: location_ar || null,
      logo_url: logo_url || null,
      contact_email: contact_email || null,
      contact_phone: contact_phone || null,
    });

    await req.user.update({ school_id: school.id });

    return res.status(201).json({
      message: "School created successfully",
      school,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getSchool = async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: "Staff",
          where: { role: "teacher", is_active: true },
          attributes: [
            "id",
            "name_en",
            "name_ar",
            "phone",
            "email",
            "grade_en",
            "grade_ar",
            "section_en",
            "section_ar",
            "avatar_url",
          ],
          required: false,
        },
      ],
    });

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    return res.status(200).json({ school });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateSchool = async (req, res) => {
  try {
    const school = await School.findByPk(req.params.id);

    if (!school) {
      return res.status(404).json({ message: "School not found" });
    }

    if (req.user.school_id !== school.id) {
      return res
        .status(403)
        .json({ message: "You can only update your own school" });
    }

    const {
      name_en,
      name_ar,
      description_en,
      description_ar,
      location_en,
      location_ar,
      logo_url,
      contact_email,
      contact_phone,
    } = req.body;

    await school.update({
      name_en: name_en || school.name_en,
      name_ar: name_ar !== undefined ? name_ar : school.name_ar,
      description_en:
        description_en !== undefined ? description_en : school.description_en,
      description_ar:
        description_ar !== undefined ? description_ar : school.description_ar,
      location_en: location_en !== undefined ? location_en : school.location_en,
      location_ar: location_ar !== undefined ? location_ar : school.location_ar,
      logo_url: logo_url !== undefined ? logo_url : school.logo_url,
      contact_email:
        contact_email !== undefined ? contact_email : school.contact_email,
      contact_phone:
        contact_phone !== undefined ? contact_phone : school.contact_phone,
    });

    return res.status(200).json({
      message: "School updated successfully",
      school,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const addTeacher = async (req, res) => {
  try {
    const {
      name_en,
      name_ar,
      phone,
      email,
      national_id,
      grade_en,
      grade_ar,
      section_en,
      section_ar,
    } = req.body;

    if (!name_en || !phone || !national_id) {
      return res.status(400).json({
        message: "name_en, phone and national_id are required",
      });
    }

    if (!req.user.school_id) {
      return res
        .status(400)
        .json({ message: "You are not linked to any school" });
    }

    const existingPhone = await User.findOne({ where: { phone } });
    if (existingPhone) {
      return res
        .status(409)
        .json({ message: "Phone number already registered" });
    }

    const existingNID = await User.findOne({ where: { national_id } });
    if (existingNID) {
      return res
        .status(409)
        .json({ message: "National ID already registered" });
    }

    if (email) {
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return res.status(409).json({ message: "Email already registered" });
      }
    }

    const otp = generateOTP();
    const otp_expires_at = getOTPExpiry();

    const teacher = await User.create({
      name_en,
      name_ar: name_ar || null,
      phone,
      email: email || null,
      password_hash: "N/A",
      national_id,
      role: "teacher",
      school_id: req.user.school_id,
      grade_en: grade_en || null,
      grade_ar: grade_ar || null,
      section_en: section_en || null,
      section_ar: section_ar || null,
      otp_code: otp,
      otp_expires_at,
      is_verified: false,
      is_active: true,
    });

    await sendOTP(phone, otp);

    return res.status(201).json({
      message: "Teacher account created. OTP sent to teacher phone.",
      teacher: {
        id: teacher.id,
        name_en: teacher.name_en,
        name_ar: teacher.name_ar,
        phone: teacher.phone,
        email: teacher.email,
        national_id: teacher.national_id,
        grade_en: teacher.grade_en,
        grade_ar: teacher.grade_ar,
        section_en: teacher.section_en,
        section_ar: teacher.section_ar,
        school_id: teacher.school_id,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getTeachers = async (req, res) => {
  try {
    if (!req.user.school_id) {
      return res
        .status(400)
        .json({ message: "You are not linked to any school" });
    }

    const teachers = await User.findAll({
      where: {
        school_id: req.user.school_id,
        role: "teacher",
        is_active: true,
      },
      attributes: [
        "id",
        "name_en",
        "name_ar",
        "phone",
        "email",
        "national_id",
        "avatar_url",
        "grade_en",
        "grade_ar",
        "section_en",
        "section_ar",
        "is_verified",
        "createdAt",
      ],
    });

    return res.status(200).json({
      total: teachers.length,
      teachers,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: {
        id: req.params.id,
        role: "teacher",
        school_id: req.user.school_id,
      },
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found in your school" });
    }

    const {
      name_en,
      name_ar,
      email,
      grade_en,
      grade_ar,
      section_en,
      section_ar,
      avatar_url,
    } = req.body;

    if (email && email !== teacher.email) {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        return res.status(409).json({ message: "Email already in use" });
      }
    }

    await teacher.update({
      name_en: name_en || teacher.name_en,
      name_ar: name_ar !== undefined ? name_ar : teacher.name_ar,
      email: email !== undefined ? email : teacher.email,
      grade_en: grade_en !== undefined ? grade_en : teacher.grade_en,
      grade_ar: grade_ar !== undefined ? grade_ar : teacher.grade_ar,
      section_en: section_en !== undefined ? section_en : teacher.section_en,
      section_ar: section_ar !== undefined ? section_ar : teacher.section_ar,
      avatar_url: avatar_url !== undefined ? avatar_url : teacher.avatar_url,
    });

    return res.status(200).json({
      message: "Teacher updated successfully",
      teacher: {
        id: teacher.id,
        name_en: teacher.name_en,
        name_ar: teacher.name_ar,
        phone: teacher.phone,
        email: teacher.email,
        grade_en: teacher.grade_en,
        grade_ar: teacher.grade_ar,
        section_en: teacher.section_en,
        section_ar: teacher.section_ar,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deactivateTeacher = async (req, res) => {
  try {
    const teacher = await User.findOne({
      where: {
        id: req.params.id,
        role: "teacher",
        school_id: req.user.school_id,
      },
    });

    if (!teacher) {
      return res
        .status(404)
        .json({ message: "Teacher not found in your school" });
    }

    await teacher.update({ is_active: false });

    return res
      .status(200)
      .json({ message: "Teacher deactivated successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getSchoolStats = async (req, res) => {
  try {
    if (!req.user.school_id) {
      return res
        .status(400)
        .json({ message: "You are not linked to any school" });
    }

    const totalTeachers = await User.count({
      where: {
        school_id: req.user.school_id,
        role: "teacher",
        is_active: true,
      },
    });

    const totalStudents = await Child.count({
      where: {
        school_id: req.user.school_id,
        is_active: true,
      },
    });

    return res.status(200).json({
      stats: {
        total_teachers: totalTeachers,
        total_students: totalStudents,
      },
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createSchool,
  getSchool,
  updateSchool,
  addTeacher,
  getTeachers,
  updateTeacher,
  deactivateTeacher,
  getSchoolStats,
};
