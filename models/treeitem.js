'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class TreeItem extends Model {
    static associate(models) {
      TreeItem.belongsTo(models.LearningTree, { foreignKey: 'tree_id' });
      TreeItem.belongsTo(models.ContentType, { foreignKey: 'content_type_id' });
    }
  }

  TreeItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      status: {
        type: DataTypes.STRING(20),
        defaultValue: 'pending',
        allowNull: false,
      },
      order_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 10,
      },
      earned_points: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      sequelize,
      modelName: 'TreeItem',
      tableName: 'tree_items',
      underscored: true,
      timestamps: false,
    }
  );

  return TreeItem;
};
