"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamResult extends Model {
    static associate(models) {
      ExamResult.belongsTo(models.ExamAssignment, { foreignKey: "exam_assignment_id" });
      ExamResult.belongsTo(models.Child, { foreignKey: "child_id" });
      ExamResult.belongsTo(models.Subject, { foreignKey: "subject_id" });
    }
  }

  ExamResult.init(
    {
      exam_assignment_id: { type: DataTypes.INTEGER, allowNull: false },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      total_marks: { type: DataTypes.INTEGER, allowNull: false },
      percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "ExamResult" },
  );

  return ExamResult;
};
