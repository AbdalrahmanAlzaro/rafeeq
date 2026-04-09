"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuestionBank extends Model {
    static associate(models) {
      QuestionBank.belongsTo(models.Subject, { foreignKey: "subject_id" });
      QuestionBank.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      QuestionBank.hasMany(models.ExamQuestion, { foreignKey: "question_id" });
      QuestionBank.hasMany(models.ExamAnswer, { foreignKey: "question_id" });
      QuestionBank.hasMany(models.ManualQuizQuestion, { foreignKey: "question_bank_id" });
    }
  }

  QuestionBank.init(
    {
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      question_text_en: { type: DataTypes.TEXT, allowNull: false },
      question_text_ar: { type: DataTypes.TEXT, allowNull: false },
      options: { type: DataTypes.JSONB, allowNull: false },
      correct_answer: { type: DataTypes.STRING, allowNull: false },
      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        allowNull: false,
        defaultValue: "medium",
      },
      points: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    },
    { sequelize, modelName: "QuestionBank" },
  );

  return QuestionBank;
};
