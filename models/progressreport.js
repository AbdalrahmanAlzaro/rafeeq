"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ProgressReport extends Model {
    static associate(models) {
      ProgressReport.belongsTo(models.Child, { foreignKey: "child_id" });
      ProgressReport.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
    }
  }

  ProgressReport.init(
    {
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      observations_en: { type: DataTypes.TEXT, allowNull: true },
      observations_ar: { type: DataTypes.TEXT, allowNull: true },
      recommendations_en: { type: DataTypes.TEXT, allowNull: true },
      recommendations_ar: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, modelName: "ProgressReport" },
  );

  return ProgressReport;
};
