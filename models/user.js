'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Child, { foreignKey: 'parent_user_id', as: 'Children' });
      User.hasMany(models.Child, { foreignKey: 'teacher_user_id', as: 'TaughtChildren' });
      User.hasMany(models.Exam, { foreignKey: 'teacher_user_id' });
      User.hasMany(models.Assignment, { foreignKey: 'teacher_user_id' });
      User.hasMany(models.QuestionBank, { foreignKey: 'teacher_user_id' });
      User.hasMany(models.Message, { foreignKey: 'sender_user_id', as: 'SentMessages' });
      User.hasMany(models.Message, { foreignKey: 'receiver_user_id', as: 'ReceivedMessages' });
      User.hasMany(models.Notification, { foreignKey: 'user_id' });
      User.belongsTo(models.School, { foreignKey: 'school_id' });
    }
  }

  User.init(
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
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      password_hash: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      national_id: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM('parent', 'teacher', 'school_admin'),
        allowNull: false,
      },
      school_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      grade_en: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      grade_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      section_en: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      section_ar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      otp_code: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      otp_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};
