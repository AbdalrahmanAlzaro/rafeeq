"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Exam extends Model {
    static associate(models) {
      Exam.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      Exam.hasMany(models.ExamSubject, { foreignKey: "exam_id" });
      Exam.hasMany(models.ExamQuestion, { foreignKey: "exam_id" });
      Exam.hasMany(models.ExamAssignment, { foreignKey: "exam_id" });
    }
  }

  Exam.init(
    {
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_ar: { type: DataTypes.STRING, allowNull: false },
      description_en: { type: DataTypes.TEXT, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, modelName: "Exam" },
  );

  return Exam;
};
