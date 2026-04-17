'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AssessmentQuestionEn extends Model {
    static associate(models) {
      AssessmentQuestionEn.belongsTo(models.AssessmentQuestion, { foreignKey: 'question_id' });
    }
  }

  AssessmentQuestionEn.init(
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
      modelName: 'AssessmentQuestionEn',
      tableName: 'assessment_questions_en',
      underscored: true,
      timestamps: false,
    }
  );

  return AssessmentQuestionEn;
};
