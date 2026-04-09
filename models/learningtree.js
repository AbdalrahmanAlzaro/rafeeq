"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LearningTree extends Model {
    static associate(models) {
      LearningTree.belongsTo(models.Child, { foreignKey: "child_id" });
      LearningTree.belongsTo(models.ExamAssignment, { foreignKey: "exam_assignment_id" });
      LearningTree.belongsTo(models.ChildNote, { foreignKey: "child_notes_id" });
      LearningTree.hasMany(models.TreeBranch, { foreignKey: "learning_tree_id" });
    }
  }

  LearningTree.init(
    {
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      exam_assignment_id: { type: DataTypes.INTEGER, allowNull: false },
      child_notes_id: { type: DataTypes.INTEGER, allowNull: true },
      status: {
        type: DataTypes.ENUM("generating", "active", "completed"),
        allowNull: false,
        defaultValue: "generating",
      },
      ai_summary: { type: DataTypes.TEXT, allowNull: true },
      generated_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "LearningTree" },
  );

  return LearningTree;
};
