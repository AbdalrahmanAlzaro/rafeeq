"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Teacher, { foreignKey: "user_id" });
      User.hasMany(models.Child, { foreignKey: "parent_user_id", as: "Children" });
      User.hasMany(models.Message, { foreignKey: "sender_user_id", as: "SentMessages" });
      User.hasMany(models.Message, { foreignKey: "receiver_user_id", as: "ReceivedMessages" });
      User.hasMany(models.Notification, { foreignKey: "user_id" });
    }
  }

  User.init(
    {
      name_en: { type: DataTypes.STRING, allowNull: false },
      name_ar: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, allowNull: true, unique: true },
      phone: { type: DataTypes.STRING, allowNull: true, unique: true },
      password_hash: { type: DataTypes.STRING, allowNull: false },
      national_id: { type: DataTypes.STRING, allowNull: true, unique: true },
      role: { type: DataTypes.ENUM("parent", "teacher", "school_admin"), allowNull: false },
      avatar_url: { type: DataTypes.STRING, allowNull: true },
    },
    { sequelize, modelName: "User" },
  );

  return User;
};
