'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class School extends Model {
    static associate(models) {
      School.hasMany(models.User, { foreignKey: 'school_id', as: 'Staff' });
      School.hasMany(models.Child, { foreignKey: 'school_id' });
    }
  }

  School.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      name_en: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name_ar: {
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
      location_en: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      logo_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      contact_phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'School',
      tableName: 'schools',
    }
  );

  return School;
};
