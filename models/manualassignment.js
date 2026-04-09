"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ManualAssignment extends Model {
    static associate(models) {
      ManualAssignment.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      ManualAssignment.belongsTo(models.Child, { foreignKey: "child_id" });
      ManualAssignment.hasOne(models.AssignmentSubmission, { foreignKey: "assignment_id" });
      ManualAssignment.hasOne(models.AssignmentFeedback, { foreignKey: "assignment_id" });
      ManualAssignment.hasOne(models.ManualQuiz, { foreignKey: "assignment_id" });
    }
  }

  ManualAssignment.init(
    {
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_ar: { type: DataTypes.STRING, allowNull: false },
      description_en: { type: DataTypes.TEXT, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
      type: { type: DataTypes.ENUM("homework", "task", "quiz"), allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed", "overdue"),
        allowNull: false,
        defaultValue: "pending",
      },
      attachment_url: { type: DataTypes.STRING, allowNull: true },
      due_date: { type: DataTypes.DATEONLY, allowNull: true },
    },
    { sequelize, modelName: "ManualAssignment" },
  );

  return ManualAssignment;
};
