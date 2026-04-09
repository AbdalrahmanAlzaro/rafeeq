"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class TaskDetail extends Model {
    static associate(models) {
      TaskDetail.belongsTo(models.TreeTask, { foreignKey: "tree_task_id" });
    }
  }

  TaskDetail.init(
    {
      tree_task_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      instructions_en: { type: DataTypes.TEXT, allowNull: true },
      instructions_ar: { type: DataTypes.TEXT, allowNull: true },
      expected_outcome_en: { type: DataTypes.TEXT, allowNull: true },
      expected_outcome_ar: { type: DataTypes.TEXT, allowNull: true },
      attachment_url: { type: DataTypes.STRING, allowNull: true },
      completed_by_parent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      confirmed_by_teacher: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      confirmed_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "TaskDetail" },
  );

  return TaskDetail;
};
