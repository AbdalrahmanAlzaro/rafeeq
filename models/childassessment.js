'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChildAssessment extends Model {
    static associate(models) {
      ChildAssessment.belongsTo(models.ChildProfile, { foreignKey: 'child_id' });
      ChildAssessment.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
      ChildAssessment.hasMany(models.ChildAssessmentAnswer, { foreignKey: 'assessment_id' });
    }
  }

  ChildAssessment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      child_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      teacher_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      result_level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChildAssessment',
      tableName: 'child_assessments',
      underscored: true,
      timestamps: false,
    }
  );

  return ChildAssessment;
};
