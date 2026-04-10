'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LearningTree extends Model {
    static associate(models) {
      LearningTree.belongsTo(models.Child, { foreignKey: 'child_id' });
      LearningTree.belongsTo(models.Exam, { foreignKey: 'exam_id' });
      LearningTree.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      LearningTree.belongsTo(models.SubjectLevel, { foreignKey: 'subject_level_id' });
      LearningTree.hasMany(models.TreeTask, { foreignKey: 'learning_tree_id' });
    }
  }

  LearningTree.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exam_id: {
        type: DataTypes.INTEGER,
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
      current_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      status: {
        type: DataTypes.ENUM('generating', 'active', 'completed'),
        allowNull: false,
        defaultValue: 'generating',
      },
      ai_summary_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ai_summary_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      generated_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'LearningTree',
      tableName: 'learning_trees',
    }
  );

  return LearningTree;
};
