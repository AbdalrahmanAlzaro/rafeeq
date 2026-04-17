'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChildScore extends Model {
    static associate(models) {
      ChildScore.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      ChildScore.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
    }
  }

  ChildScore.init(
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
      total_score: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: { min: 0 },
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChildScore',
      tableName: 'child_scores',
      underscored: true,
      timestamps: false,
    }
  );

  return ChildScore;
};
