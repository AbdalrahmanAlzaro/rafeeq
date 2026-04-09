"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ManualQuizQuestion extends Model {
    static associate(models) {
      ManualQuizQuestion.belongsTo(models.ManualQuiz, { foreignKey: "manual_quiz_id" });
      ManualQuizQuestion.belongsTo(models.QuestionBank, { foreignKey: "question_bank_id" });
      ManualQuizQuestion.hasMany(models.ManualQuizAnswer, { foreignKey: "question_id" });
    }
  }

  ManualQuizQuestion.init(
    {
      manual_quiz_id: { type: DataTypes.INTEGER, allowNull: false },
      question_bank_id: { type: DataTypes.INTEGER, allowNull: true },
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
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      source: {
        type: DataTypes.ENUM("manual", "bank"),
        allowNull: false,
        defaultValue: "manual",
      },
    },
    { sequelize, modelName: "ManualQuizQuestion" },
  );

  return ManualQuizQuestion;
};
