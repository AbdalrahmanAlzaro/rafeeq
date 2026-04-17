'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class LearningTree extends Model {
    static associate(models) {
      LearningTree.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      LearningTree.hasMany(models.TreeItem, { foreignKey: 'tree_id' });
      LearningTree.hasMany(models.ChildScore, { foreignKey: 'tree_id' });
      LearningTree.hasMany(models.ChildScoreLog, { foreignKey: 'tree_id' });
    }
  }

  LearningTree.init(
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
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      topic: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'active',
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'LearningTree',
      tableName: 'learning_trees',
      underscored: true,
      timestamps: false,
    }
  );

  return LearningTree;
};
