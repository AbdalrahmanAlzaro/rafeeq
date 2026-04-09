"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamAssignment extends Model {
    static associate(models) {
      ExamAssignment.belongsTo(models.Exam, { foreignKey: "exam_id" });
      ExamAssignment.belongsTo(models.Child, { foreignKey: "child_id" });
      ExamAssignment.hasMany(models.ExamResult, { foreignKey: "exam_assignment_id" });
      ExamAssignment.hasMany(models.ExamAnswer, { foreignKey: "exam_assignment_id" });
      ExamAssignment.hasOne(models.LearningTree, { foreignKey: "exam_assignment_id" });
    }
  }

  ExamAssignment.init(
    {
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM("pending", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "pending",
      },
      assigned_at: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "ExamAssignment" },
  );

  return ExamAssignment;
};
