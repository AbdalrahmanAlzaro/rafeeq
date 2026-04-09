"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamQuestion extends Model {
    static associate(models) {
      ExamQuestion.belongsTo(models.Exam, { foreignKey: "exam_id" });
      ExamQuestion.belongsTo(models.Subject, { foreignKey: "subject_id" });
      ExamQuestion.belongsTo(models.QuestionBank, { foreignKey: "question_id" });
    }
  }

  ExamQuestion.init(
    {
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "ExamQuestion" },
  );

  return ExamQuestion;
};
