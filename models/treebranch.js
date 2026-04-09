"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TreeBranch extends Model {
    static associate(models) {
      TreeBranch.belongsTo(models.LearningTree, { foreignKey: "learning_tree_id" });
      TreeBranch.belongsTo(models.Subject, { foreignKey: "subject_id" });
      TreeBranch.hasMany(models.TreeTask, { foreignKey: "branch_id" });
    }
  }

  TreeBranch.init(
    {
      learning_tree_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      score_percentage: { type: DataTypes.FLOAT, allowNull: false, defaultValue: 0 },
      level: {
        type: DataTypes.ENUM("critical", "needs_work", "good", "excellent"),
        allowNull: false,
      },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    },
    { sequelize, modelName: "TreeBranch" },
  );

  return TreeBranch;
};
