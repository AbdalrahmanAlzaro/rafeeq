'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TreeTask extends Model {
    static associate(models) {
      TreeTask.belongsTo(models.LearningTree, { foreignKey: 'learning_tree_id' });
    }
  }

  TreeTask.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      learning_tree_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('task', 'activity', 'quiz'),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('locked', 'in_progress', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'locked',
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      instructions_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      instructions_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expected_outcome_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      expected_outcome_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      materials_needed_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      materials_needed_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      attachment_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      done_by_parent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmed_by_teacher: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      teacher_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      teacher_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      question_ids: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      passing_score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 60,
      },
      answers: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      percentage: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      passed: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      attempt_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TreeTask',
      tableName: 'tree_tasks',
    }
  );

  return TreeTask;
};
