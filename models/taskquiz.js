"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskQuiz extends Model {
    static associate(models) {
      TaskQuiz.belongsTo(models.TreeTask, { foreignKey: "tree_task_id" });
      TaskQuiz.hasMany(models.TaskQuizQuestion, { foreignKey: "task_quiz_id" });
      TaskQuiz.hasMany(models.TaskQuizAttempt, { foreignKey: "task_quiz_id" });
    }
  }

  TaskQuiz.init(
    {
      tree_task_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      total_questions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      passing_score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
      attempts_allowed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    },
    { sequelize, modelName: "TaskQuiz" },
  );

  return TaskQuiz;
};
