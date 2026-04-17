'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      Activity.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
    }
  }

  Activity.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      instructions_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      instructions_en: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      materials_needed_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      materials_needed_en: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
        defaultValue: null,
      },
      expected_outcome_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      expected_outcome_en: {
        type: DataTypes.TEXT,
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
      modelName: 'Activity',
      tableName: 'activities',
      underscored: true,
      timestamps: false,
    }
  );

  return Activity;
};
