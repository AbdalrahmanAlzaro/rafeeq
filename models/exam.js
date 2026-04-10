'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.belongsTo(models.User, { foreignKey: 'teacher_user_id', as: 'Teacher' });
      Exam.belongsTo(models.Child, { foreignKey: 'child_id' });
      Exam.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Exam.hasOne(models.LearningTree, { foreignKey: 'exam_id' });
    }
  }

  Exam.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      teacher_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      question_ids: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      assigned_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      total_marks: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      attention_color: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Exam',
      tableName: 'exams',
    }
  );

  return Exam;
};
