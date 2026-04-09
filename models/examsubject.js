"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ExamSubject extends Model {
    static associate(models) {
      ExamSubject.belongsTo(models.Exam, { foreignKey: "exam_id" });
      ExamSubject.belongsTo(models.Subject, { foreignKey: "subject_id" });
    }
  }

  ExamSubject.init(
    {
      exam_id: { type: DataTypes.INTEGER, allowNull: false },
      subject_id: { type: DataTypes.INTEGER, allowNull: false },
      total_marks: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 100 },
    },
    { sequelize, modelName: "ExamSubject" },
  );

  return ExamSubject;
};
