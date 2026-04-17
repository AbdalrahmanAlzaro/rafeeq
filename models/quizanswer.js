'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class QuizAnswer extends Model {
    static associate(models) {
      QuizAnswer.belongsTo(models.Quiz, { foreignKey: 'quiz_id' });
      QuizAnswer.belongsTo(models.QuizQuestion, { foreignKey: 'question_id' });
    }
  }

  QuizAnswer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      quiz_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      selected_option: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      answered_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'QuizAnswer',
      tableName: 'quiz_answers',
      underscored: true,
      timestamps: false,
    }
  );

  return QuizAnswer;
};
