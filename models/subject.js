"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subject extends Model {
    static associate(models) {
      Subject.hasMany(models.QuestionBank, { foreignKey: "subject_id" });
      Subject.hasMany(models.ExamSubject, { foreignKey: "subject_id" });
      Subject.hasMany(models.ExamQuestion, { foreignKey: "subject_id" });
      Subject.hasMany(models.ExamResult, { foreignKey: "subject_id" });
      Subject.hasMany(models.TreeBranch, { foreignKey: "subject_id" });
    }
  }

  Subject.init(
    {
      name_en: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING, allowNull: false },
      description_en: { type: DataTypes.TEXT, allowNull: true },
      description_ar: { type: DataTypes.TEXT, allowNull: true },
      color_code: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, modelName: "Subject" },
  );

  return Subject;
};
