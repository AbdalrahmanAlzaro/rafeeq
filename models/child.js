"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.belongsTo(models.User, { foreignKey: "parent_user_id", as: "Parent" });
      Child.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      Child.belongsTo(models.School, { foreignKey: "school_id" });
      Child.hasMany(models.ChildNote, { foreignKey: "child_id" });
      Child.hasMany(models.ExamAssignment, { foreignKey: "child_id" });
      Child.hasMany(models.ExamResult, { foreignKey: "child_id" });
      Child.hasMany(models.LearningTree, { foreignKey: "child_id" });
      Child.hasMany(models.ManualAssignment, { foreignKey: "child_id" });
      Child.hasMany(models.ProgressReport, { foreignKey: "child_id" });
      Child.hasMany(models.TaskQuizAttempt, { foreignKey: "child_id" });
      Child.hasMany(models.ManualQuizAttempt, { foreignKey: "child_id" });
      Child.hasMany(models.AssignmentSubmission, { foreignKey: "child_id" });
    }
  }

  Child.init(
    {
      parent_user_id: { type: DataTypes.INTEGER, allowNull: false },
      teacher_id: { type: DataTypes.INTEGER, allowNull: true },
      school_id: { type: DataTypes.INTEGER, allowNull: true },
      name_en: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING, allowNull: false },
      date_of_birth: { type: DataTypes.DATEONLY, allowNull: true },
      national_id: { type: DataTypes.STRING, allowNull: true, unique: true },
      special_need_type: {
        type: DataTypes.ENUM("autism", "adhd", "dyslexia", "down_syndrome", "other"),
        allowNull: true,
      },
    },
    { sequelize, modelName: "Child" },
  );

  return Child;
};
