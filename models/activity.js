'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Activity extends Model {
    static associate(models) {
      Activity.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
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
