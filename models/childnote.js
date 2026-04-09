"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ChildNote extends Model {
    static associate(models) {
      ChildNote.belongsTo(models.Child, { foreignKey: "child_id" });
      ChildNote.belongsTo(models.Teacher, { foreignKey: "teacher_id" });
      ChildNote.hasMany(models.LearningTree, { foreignKey: "child_notes_id" });
    }
  }

  ChildNote.init(
    {
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      teacher_id: { type: DataTypes.INTEGER, allowNull: false },
      behavioral_notes_en: { type: DataTypes.TEXT, allowNull: true },
      behavioral_notes_ar: { type: DataTypes.TEXT, allowNull: true },
      communication_notes_en: { type: DataTypes.TEXT, allowNull: true },
      communication_notes_ar: { type: DataTypes.TEXT, allowNull: true },
      social_notes_en: { type: DataTypes.TEXT, allowNull: true },
      social_notes_ar: { type: DataTypes.TEXT, allowNull: true },
      attention_notes_en: { type: DataTypes.TEXT, allowNull: true },
      attention_notes_ar: { type: DataTypes.TEXT, allowNull: true },
      additional_notes_en: { type: DataTypes.TEXT, allowNull: true },
      additional_notes_ar: { type: DataTypes.TEXT, allowNull: true },
    },
    { sequelize, modelName: "ChildNote" },
  );

  return ChildNote;
};
