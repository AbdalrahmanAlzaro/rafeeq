"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ManualQuiz extends Model {
    static associate(models) {
      ManualQuiz.belongsTo(models.ManualAssignment, { foreignKey: "assignment_id" });
      ManualQuiz.hasMany(models.ManualQuizQuestion, { foreignKey: "manual_quiz_id" });
      ManualQuiz.hasMany(models.ManualQuizAttempt, { foreignKey: "manual_quiz_id" });
    }
  }

  ManualQuiz.init(
    {
      assignment_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      total_questions: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      passing_score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 60 },
      attempts_allowed: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 },
    },
    { sequelize, modelName: "ManualQuiz" },
  );

  return ManualQuiz;
};
