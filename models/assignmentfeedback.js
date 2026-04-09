"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssignmentFeedback extends Model {
    static associate(models) {
      AssignmentFeedback.belongsTo(models.ManualAssignment, { foreignKey: "assignment_id" });
      AssignmentFeedback.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
    }
  }

  AssignmentFeedback.init(
    {
      assignment_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      feedback_en: { type: DataTypes.TEXT, allowNull: true },
      feedback_ar: { type: DataTypes.TEXT, allowNull: true },
      grade: { type: DataTypes.INTEGER, allowNull: true },
    },
    { sequelize, modelName: "AssignmentFeedback" },
  );

  return AssignmentFeedback;
};
