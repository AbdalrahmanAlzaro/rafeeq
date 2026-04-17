'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class AssessmentQuestion extends Model {
    static associate(models) {
      AssessmentQuestion.hasOne(models.AssessmentQuestionAr, { foreignKey: 'question_id' });
      AssessmentQuestion.hasOne(models.AssessmentQuestionEn, { foreignKey: 'question_id' });
      AssessmentQuestion.hasMany(models.ChildAssessmentAnswer, { foreignKey: 'question_id' });
    }
  }

  AssessmentQuestion.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      correct_option: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      order_num: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AssessmentQuestion',
      tableName: 'assessment_questions',
      underscored: true,
      timestamps: false,
    }
  );

  return AssessmentQuestion;
};
