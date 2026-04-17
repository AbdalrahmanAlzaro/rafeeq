'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AssessmentQuestionAr extends Model {
    static associate(models) {
      AssessmentQuestionAr.belongsTo(models.AssessmentQuestion, { foreignKey: 'question_id' });
    }
  }

  AssessmentQuestionAr.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      question_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      option_1: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_2: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_3: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      option_4: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AssessmentQuestionAr',
      tableName: 'assessment_questions_ar',
      underscored: true,
      timestamps: false,
    }
  );

  return AssessmentQuestionAr;
};
