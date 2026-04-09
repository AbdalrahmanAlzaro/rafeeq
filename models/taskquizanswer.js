"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskQuizAnswer extends Model {
    static associate(models) {
      TaskQuizAnswer.belongsTo(models.TaskQuizAttempt, { foreignKey: "attempt_id" });
      TaskQuizAnswer.belongsTo(models.TaskQuizQuestion, { foreignKey: "question_id" });
    }
  }

  TaskQuizAnswer.init(
    {
      attempt_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      answer_given: { type: DataTypes.STRING, allowNull: true },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      points_earned: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "TaskQuizAnswer" },
  );

  return TaskQuizAnswer;
};
