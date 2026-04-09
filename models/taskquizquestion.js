"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskQuizQuestion extends Model {
    static associate(models) {
      TaskQuizQuestion.belongsTo(models.TaskQuiz, { foreignKey: "task_quiz_id" });
      TaskQuizQuestion.hasMany(models.TaskQuizAnswer, { foreignKey: "question_id" });
    }
  }

  TaskQuizQuestion.init(
    {
      task_quiz_id: { type: DataTypes.INTEGER, allowNull: false },
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
    },
    { sequelize, modelName: "TaskQuizQuestion" },
  );

  return TaskQuizQuestion;
};
