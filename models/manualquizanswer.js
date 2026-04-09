"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ManualQuizAnswer extends Model {
    static associate(models) {
      ManualQuizAnswer.belongsTo(models.ManualQuizAttempt, { foreignKey: "attempt_id" });
      ManualQuizAnswer.belongsTo(models.ManualQuizQuestion, { foreignKey: "question_id" });
    }
  }

  ManualQuizAnswer.init(
    {
      attempt_id: { type: DataTypes.INTEGER, allowNull: false },
      question_id: { type: DataTypes.INTEGER, allowNull: false },
      answer_given: { type: DataTypes.STRING, allowNull: true },
      is_correct: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      points_earned: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "ManualQuizAnswer" },
  );

  return ManualQuizAnswer;
};
