'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class QuestionBank extends Model {
    static associate(models) {
      QuestionBank.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      QuestionBank.belongsTo(models.SubjectLevel, { foreignKey: 'subject_level_id' });
      QuestionBank.belongsTo(models.User, { foreignKey: 'teacher_user_id', as: 'Teacher' });
    }
  }

  QuestionBank.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject_level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      question_text_en: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      question_text_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      options: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      correct_answer: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      difficulty: {
        type: DataTypes.ENUM('easy', 'medium', 'hard'),
        allowNull: false,
        defaultValue: 'medium',
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: 'QuestionBank',
      tableName: 'question_banks',
    }
  );

  return QuestionBank;
};
