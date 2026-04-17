'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChildAssessmentAnswer extends Model {
    static associate(models) {
      ChildAssessmentAnswer.belongsTo(models.ChildAssessment, { foreignKey: 'assessment_id' });
      ChildAssessmentAnswer.belongsTo(models.AssessmentQuestion, { foreignKey: 'question_id' });
    }
  }

  ChildAssessmentAnswer.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      assessment_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      selected_option: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      is_correct: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      answered_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ChildAssessmentAnswer',
      tableName: 'child_assessment_answers',
      underscored: true,
      timestamps: false,
    }
  );

  return ChildAssessmentAnswer;
};
