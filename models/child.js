'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Child extends Model {
    static associate(models) {
      Child.belongsTo(models.User, { foreignKey: 'parent_user_id', as: 'Parent' });
      Child.belongsTo(models.User, { foreignKey: 'teacher_user_id', as: 'Teacher' });
      Child.belongsTo(models.School, { foreignKey: 'school_id' });
      Child.hasMany(models.Exam, { foreignKey: 'child_id' });
      Child.hasMany(models.Assignment, { foreignKey: 'child_id' });
      Child.hasMany(models.LearningTree, { foreignKey: 'child_id' });
      Child.hasMany(models.Message, { foreignKey: 'child_id' });
    }
  }

  Child.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      parent_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      teacher_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      national_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      special_need_type: {
        type: DataTypes.ENUM('autism', 'adhd', 'dyslexia', 'down_syndrome', 'other'),
        allowNull: true,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      behavioral_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      behavioral_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      communication_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      communication_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      social_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      social_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attention_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      attention_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      additional_notes_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      additional_notes_ar: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Child',
      tableName: 'children',
    }
  );

  return Child;
};
