"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TreeTask extends Model {
    static associate(models) {
      TreeTask.belongsTo(models.TreeBranch, { foreignKey: "branch_id" });
      TreeTask.hasOne(models.TaskDetail, { foreignKey: "tree_task_id" });
      TreeTask.hasOne(models.ActivityDetail, { foreignKey: "tree_task_id" });
      TreeTask.hasOne(models.TaskQuiz, { foreignKey: "tree_task_id" });
    }
  }

  TreeTask.init(
    {
      branch_id: { type: DataTypes.INTEGER, allowNull: false },
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_ar: { type: DataTypes.STRING, allowNull: false },
      description_en: { type: DataTypes.TEXT, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
      type: { type: DataTypes.ENUM("task", "activity", "quiz"), allowNull: false },
      status: {
        type: DataTypes.ENUM("locked", "pending", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "locked",
      },
      order: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
      due_date: { type: DataTypes.DATE, allowNull: true },
      completed_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "TreeTask" },
  );

  return TreeTask;
};
