'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class QuizQuestion extends Model {
    static associate(models) {
      QuizQuestion.belongsTo(models.Quiz, { foreignKey: 'quiz_id' });
      QuizQuestion.hasMany(models.QuizAnswer, { foreignKey: 'question_id' });
    }
  }

  QuizQuestion.init(
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
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_1: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_2: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_3: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_4: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      correct_option: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'QuizQuestion',
      tableName: 'quiz_questions',
      underscored: true,
      timestamps: false,
    }
  );

  return QuizQuestion;
};
