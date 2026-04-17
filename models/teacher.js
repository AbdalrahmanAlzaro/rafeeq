'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Teacher extends Model {
    static associate(models) {
      Teacher.belongsTo(models.User, { foreignKey: 'user_id' });
      Teacher.belongsTo(models.School, { foreignKey: 'school_id' });
      Teacher.hasMany(models.ChildProfile, { foreignKey: 'teacher_id' });
      Teacher.hasMany(models.Homework, { foreignKey: 'teacher_id' });
      Teacher.hasMany(models.ChildAssessment, { foreignKey: 'teacher_id' });
    }
  }

  Teacher.init(
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
      school_id: {
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
      specialization: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Teacher',
      tableName: 'teachers',
      underscored: true,
      timestamps: false,
    }
  );

  return Teacher;
};
