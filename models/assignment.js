'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Assignment extends Model {
    static associate(models) {
      Assignment.belongsTo(models.User, { foreignKey: 'teacher_user_id', as: 'Teacher' });
      Assignment.belongsTo(models.Child, { foreignKey: 'child_id' });
      Assignment.belongsTo(models.Subject, { foreignKey: 'subject_id' });
    }
  }

  Assignment.init(
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
        allowNull: true,
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('homework', 'task'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'overdue'),
        allowNull: false,
        defaultValue: 'pending',
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      attachment_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      submission_note_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submission_note_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      submission_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      submission_status: {
        type: DataTypes.ENUM('submitted', 'late'),
        allowNull: true,
      },
      feedback_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      feedback_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Assignment',
      tableName: 'assignments',
    }
  );

  return Assignment;
};
