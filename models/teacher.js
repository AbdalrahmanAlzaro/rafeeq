"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsTo(models.User, { foreignKey: "user_id" });
      Teacher.belongsTo(models.School, { foreignKey: "school_id" });
      Teacher.hasMany(models.Child, { foreignKey: "teacher_id" });
      Teacher.hasMany(models.ChildNote, { foreignKey: "teacher_id" });
      Teacher.hasMany(models.QuestionBank, { foreignKey: "teacher_id" });
      Teacher.hasMany(models.Exam, { foreignKey: "teacher_id" });
      Teacher.hasMany(models.ManualAssignment, { foreignKey: "teacher_id" });
      Teacher.hasMany(models.ProgressReport, { foreignKey: "teacher_id" });
    }
  }

  Teacher.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      school_id: { type: DataTypes.INTEGER, allowNull: true },
      grade_en: { type: DataTypes.STRING, allowNull: true },
      grade_ar: { type: DataTypes.STRING, allowNull: true },
      section_en: { type: DataTypes.STRING, allowNull: true },
      section_ar: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, modelName: "Teacher" },
  );

  return Teacher;
};
