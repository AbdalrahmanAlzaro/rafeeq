"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AssignmentSubmission extends Model {
    static associate(models) {
      AssignmentSubmission.belongsTo(models.ManualAssignment, { foreignKey: "assignment_id" });
      AssignmentSubmission.belongsTo(models.Child, { foreignKey: "child_id" });
    }
  }

  AssignmentSubmission.init(
    {
      assignment_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      child_id: { type: DataTypes.INTEGER, allowNull: false },
      note: { type: DataTypes.TEXT, allowNull: true },
      attachment_url: { type: DataTypes.STRING, allowNull: true },
      status: {
        type: DataTypes.ENUM("submitted", "late"),
        allowNull: false,
        defaultValue: "submitted",
      },
      submitted_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "AssignmentSubmission" },
  );

  return AssignmentSubmission;
};
