'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class School extends Model {
    static associate(models) {
      School.belongsTo(models.User, { foreignKey: 'user_id' });
      School.hasMany(models.Teacher, { foreignKey: 'school_id' });
    }
  }

  School.init(
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
      name_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING(15),
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
      modelName: 'School',
      tableName: 'schools',
      underscored: true,
      timestamps: false,
    }
  );

  return School;
};
