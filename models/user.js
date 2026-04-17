'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.School, { foreignKey: 'user_id' });
      User.hasOne(models.Teacher, { foreignKey: 'user_id' });
      User.hasOne(models.Parent, { foreignKey: 'user_id' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
      User.hasMany(models.SavedArticle, { foreignKey: 'user_id' });
      User.hasMany(models.ChatbotSession, { foreignKey: 'user_id' });
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('parent', 'teacher', 'child', 'school'),
        allowNull: false,
      },
      national_id: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      phone: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      language: {
        type: DataTypes.ENUM('ar', 'en'),
        defaultValue: 'ar',
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      timestamps: false,
    }
  );

  return User;
};
