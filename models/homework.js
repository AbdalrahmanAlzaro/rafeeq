'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Homework extends Model {
    static associate(models) {
      Homework.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
      Homework.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      Homework.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
    }
  }

  Homework.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      teacher_file_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      child_file_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      feedback_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      feedback_en: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      grade: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      approved_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      tree_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
      tree_item_id: {
        type: DataTypes.UUID,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'Homework',
      tableName: 'homeworks',
      underscored: true,
      timestamps: false,
    }
  );

  return Homework;
};
