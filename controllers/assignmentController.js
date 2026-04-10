const { Assignment, Child, User, Subject, Notification } = require("../models");

const createAssignment = async (req, res) => {
  try {
    const {
      child_id,
      subject_id,
      title_en,
      title_ar,
      description_en,
      description_ar,
      type,
      due_date,
      attachment_url,
    } = req.body;

    if (!child_id || !title_en || !type) {
      return res.status(400).json({
        message: "child_id, title_en and type are required",
      });
    }

    const validTypes = ["homework", "task"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: "type must be homework or task",
      });
    }

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (child.teacher_user_id !== req.user.id) {
      return res.status(403).json({
        message: "You can only assign work to your own students",
      });
    }

    if (subject_id) {
      const subject = await Subject.findByPk(subject_id);
      if (!subject) {
        return res.status(404).json({ message: "Subject not found" });
      }
    }

    const assignment = await Assignment.create({
      teacher_user_id: req.user.id,
      child_id,
      subject_id: subject_id || null,
      title_en,
      title_ar: title_ar || null,
      description_en: description_en || null,
      description_ar: description_ar || null,
      type,
      status: "pending",
      due_date: due_date || null,
      attachment_url: attachment_url || null,
    });

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "New Assignment",
      title_ar: "واجب جديد",
      body_en: `${req.user.name_en} assigned "${title_en}" to ${child.name_en}.`,
      body_ar: `قام ${req.user.name_ar} بتعيين "${title_ar || title_en}" لـ ${child.name_ar}.`,
      type: type === "homework" ? "homework" : "assignment",
      is_read: false,
    });

    return res.status(201).json({
      message: "Assignment created successfully",
      assignment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getChildAssignments = async (req, res) => {
  try {
    const { child_id } = req.params;
    const { status, type } = req.query;

    const child = await Child.findOne({
      where: { id: child_id, is_active: true },
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

    const where = { child_id };
    if (status) where.status = status;
    if (type) where.type = type;

    const assignments = await Assignment.findAll({
      where,
      include: [
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
          required: false,
        },
        {
          model: User,
          as: "Teacher",
          attributes: ["id", "name_en", "name_ar", "avatar_url"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const now = new Date();
    for (const assignment of assignments) {
      if (
        assignment.status === "pending" &&
        assignment.due_date &&
        new Date(assignment.due_date) < now
      ) {
        await assignment.update({ status: "overdue" });
      }
    }

    return res.status(200).json({
      total: assignments.length,
      assignments,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getMyAssignments = async (req, res) => {
  try {
    const { status, type } = req.query;

    const where = { teacher_user_id: req.user.id };
    if (status) where.status = status;
    if (type) where.type = type;

    const assignments = await Assignment.findAll({
      where,
      include: [
        {
          model: Child,
          attributes: ["id", "name_en", "name_ar", "special_need_type"],
        },
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
          required: false,
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: assignments.length,
      assignments,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id, {
      include: [
        {
          model: Child,
          attributes: ["id", "name_en", "name_ar", "special_need_type"],
        },
        {
          model: Subject,
          attributes: ["id", "name_en", "name_ar", "color_code"],
          required: false,
        },
        {
          model: User,
          as: "Teacher",
          attributes: ["id", "name_en", "name_ar", "avatar_url"],
        },
      ],
    });

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const child = await Child.findByPk(assignment.child_id);
    const isParent = child.parent_user_id === req.user.id;
    const isTeacher = assignment.teacher_user_id === req.user.id;
    const isAdmin = req.user.role === "school_admin";

    if (!isParent && !isTeacher && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json({ assignment });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher_user_id !== req.user.id) {
      return res.status(403).json({
        message: "Only the teacher who created this assignment can update it",
      });
    }

    if (assignment.status === "completed") {
      return res.status(400).json({
        message: "Cannot update a completed assignment",
      });
    }

    const {
      title_en,
      title_ar,
      description_en,
      description_ar,
      due_date,
      attachment_url,
    } = req.body;

    await assignment.update({
      title_en: title_en || assignment.title_en,
      title_ar: title_ar !== undefined ? title_ar : assignment.title_ar,
      description_en:
        description_en !== undefined
          ? description_en
          : assignment.description_en,
      description_ar:
        description_ar !== undefined
          ? description_ar
          : assignment.description_ar,
      due_date: due_date !== undefined ? due_date : assignment.due_date,
      attachment_url:
        attachment_url !== undefined
          ? attachment_url
          : assignment.attachment_url,
    });

    return res.status(200).json({
      message: "Assignment updated successfully",
      assignment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const submitAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.status === "completed") {
      return res.status(400).json({ message: "Assignment already completed" });
    }

    if (assignment.status === "overdue") {
      return res.status(400).json({ message: "Assignment is overdue" });
    }

    const child = await Child.findByPk(assignment.child_id);

    if (child.parent_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the parent can submit this assignment" });
    }

    const { note_en, note_ar, submission_url } = req.body;

    const now = new Date();
    const isLate = assignment.due_date && new Date(assignment.due_date) < now;

    await assignment.update({
      status: "in_progress",
      submitted_at: now,
      submission_note_en: note_en || null,
      submission_note_ar: note_ar || null,
      submission_url: submission_url || null,
      submission_status: isLate ? "late" : "submitted",
    });

    await Notification.create({
      user_id: assignment.teacher_user_id,
      title_en: "Assignment Submitted",
      title_ar: "تم تسليم الواجب",
      body_en: `${child.name_en}'s parent submitted "${assignment.title_en}".${isLate ? " (Late submission)" : ""}`,
      body_ar: `قدّم ولي أمر ${child.name_ar} "${assignment.title_ar || assignment.title_en}".${isLate ? " (تسليم متأخر)" : ""}`,
      type: "assignment",
      is_read: false,
    });

    return res.status(200).json({
      message: isLate
        ? "Assignment submitted late"
        : "Assignment submitted successfully",
      assignment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const giveFeedback = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the assigned teacher can give feedback" });
    }

    if (!assignment.submitted_at) {
      return res
        .status(400)
        .json({ message: "Assignment has not been submitted yet" });
    }

    const { feedback_en, feedback_ar, grade } = req.body;

    if (!feedback_en && !feedback_ar && grade === undefined) {
      return res.status(400).json({ message: "feedback or grade is required" });
    }

    if (grade !== undefined && (grade < 0 || grade > 100)) {
      return res
        .status(400)
        .json({ message: "grade must be between 0 and 100" });
    }

    await assignment.update({
      status: "completed",
      feedback_en: feedback_en || null,
      feedback_ar: feedback_ar || null,
      grade: grade !== undefined ? grade : null,
    });

    const child = await Child.findByPk(assignment.child_id);

    await Notification.create({
      user_id: child.parent_user_id,
      title_en: "Assignment Reviewed",
      title_ar: "تمت مراجعة الواجب",
      body_en: `${req.user.name_en} reviewed "${assignment.title_en}"${grade !== undefined ? ` and gave a grade of ${grade}/100.` : "."}`,
      body_ar: `راجع ${req.user.name_ar} "${assignment.title_ar || assignment.title_en}"${grade !== undefined ? ` وأعطى درجة ${grade}/100.` : "."}`,
      type: "assignment",
      is_read: false,
    });

    return res.status(200).json({
      message: "Feedback submitted successfully",
      assignment,
    });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findByPk(req.params.id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    if (assignment.teacher_user_id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the teacher who created this can delete it" });
    }

    if (assignment.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending assignments can be deleted" });
    }

    await assignment.destroy();

    return res.status(200).json({ message: "Assignment deleted successfully" });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createAssignment,
  getChildAssignments,
  getMyAssignments,
  getAssignment,
  updateAssignment,
  submitAssignment,
  giveFeedback,
  deleteAssignment,
};
