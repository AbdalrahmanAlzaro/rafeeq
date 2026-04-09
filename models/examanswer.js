"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamAnswer extends Model {
    static associate(models) {
      ExamAnswer.belongsTo(models.ExamAssignment, { foreignKey: "exam_assignment_id" });
      ExamAnswer.belongsTo(models.QuestionBank, { foreignKey: "question_id" });
    }
  }

  ExamAnswer.init(
    {
      exam_assignment_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      answer_given: { type: DataTypes.STRING, allowNull: true },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      points_earned: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "ExamAnswer" },
  );

  return ExamAnswer;
};
