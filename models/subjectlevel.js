'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SubjectLevel extends Model {
    static associate(models) {
      SubjectLevel.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      SubjectLevel.hasMany(models.QuestionBank, { foreignKey: 'subject_level_id' });
      SubjectLevel.hasMany(models.LearningTree, { foreignKey: 'subject_level_id' });
    }
  }

  SubjectLevel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      level_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      description_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'SubjectLevel',
      tableName: 'subject_levels',
    }
  );

  return SubjectLevel;
};
