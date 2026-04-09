"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ActivityDetail extends Model {
    static associate(models) {
      ActivityDetail.belongsTo(models.TreeTask, { foreignKey: "tree_task_id" });
    }
  }

  ActivityDetail.init(
    {
      tree_task_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      instructions_en: { type: DataTypes.TEXT, allowNull: true },
      instructions_ar: { type: DataTypes.TEXT, allowNull: true },
      materials_needed_en: { type: DataTypes.TEXT, allowNull: true },
      materials_needed_ar: { type: DataTypes.TEXT, allowNull: true },
      expected_behavior_en: { type: DataTypes.TEXT, allowNull: true },
      expected_behavior_ar: { type: DataTypes.TEXT, allowNull: true },
      media_url: { type: DataTypes.STRING, allowNull: true },
      done_by_parent: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      verified_by_teacher: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      teacher_notes_en: { type: DataTypes.TEXT, allowNull: true },
      teacher_notes_ar: { type: DataTypes.TEXT, allowNull: true },
      verified_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "ActivityDetail" },
  );

  return ActivityDetail;
};
