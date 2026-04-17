'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChildProfile extends Model {
    static associate(models) {
      ChildProfile.belongsTo(models.User, { foreignKey: 'user_id' });
      ChildProfile.belongsTo(models.Parent, { foreignKey: 'parent_id' });
      ChildProfile.belongsTo(models.Teacher, { foreignKey: 'teacher_id' });
      ChildProfile.hasMany(models.ChildAssessment, { foreignKey: 'child_id' });
      ChildProfile.hasMany(models.LearningTree, { foreignKey: 'child_id' });
      ChildProfile.hasMany(models.Quiz, { foreignKey: 'child_id' });
      ChildProfile.hasMany(models.Homework, { foreignKey: 'child_id' });
      ChildProfile.hasMany(models.Activity, { foreignKey: 'child_id' });
      ChildProfile.hasMany(models.ChildScore, { foreignKey: 'child_id' });
    }
  }

  ChildProfile.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      teacher_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      full_name_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      learning_difficulty: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        allowNull: false,
      },
      class_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      photo_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChildProfile',
      tableName: 'child_profiles',
      underscored: true,
      timestamps: false,
    }
  );

  return ChildProfile;
};
