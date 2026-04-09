"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskQuizAttempt extends Model {
    static associate(models) {
      TaskQuizAttempt.belongsTo(models.TaskQuiz, { foreignKey: "task_quiz_id" });
      TaskQuizAttempt.belongsTo(models.Child, { foreignKey: "child_id" });
      TaskQuizAttempt.hasMany(models.TaskQuizAnswer, { foreignKey: "attempt_id" });
    }
  }

  TaskQuizAttempt.init(
    {
      task_quiz_id: { type: DataTypes.INTEGER, allowNull: false },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      total_marks: { type: DataTypes.INTEGER, allowNull: false },
      percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      attempt_number: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      taken_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "TaskQuizAttempt" },
  );

  return TaskQuizAttempt;
};
