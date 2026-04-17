'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChildScoreLog extends Model {
    static associate(models) {
      ChildScoreLog.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      ChildScoreLog.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
      ChildScoreLog.belongsTo(models.ContentType, { foreignKey: 'content_type_id' });
    }
  }

  ChildScoreLog.init(
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
      tree_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      content_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      item_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      max_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      earned_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      submitted_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChildScoreLog',
      tableName: 'child_score_logs',
      underscored: true,
      timestamps: false,
    }
  );

  return ChildScoreLog;
};
