"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ManualQuizAttempt extends Model {
    static associate(models) {
      ManualQuizAttempt.belongsTo(models.ManualQuiz, { foreignKey: "manual_quiz_id" });
      ManualQuizAttempt.belongsTo(models.Child, { foreignKey: "child_id" });
      ManualQuizAttempt.hasMany(models.ManualQuizAnswer, { foreignKey: "attempt_id" });
    }
  }

  ManualQuizAttempt.init(
    {
      manual_quiz_id: { type: DataTypes.INTEGER, allowNull: false },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      score: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      total_marks: { type: DataTypes.INTEGER, allowNull: false },
      percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      passed: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      attempt_number: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
      taken_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "ManualQuizAttempt" },
  );

  return ManualQuizAttempt;
};
