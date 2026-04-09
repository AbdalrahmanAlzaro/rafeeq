"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }

  Notification.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      title_en: { type: DataTypes.STRING, allowNull: false },
      title_ar: { type: DataTypes.STRING, allowNull: false },
      body_en: { type: DataTypes.TEXT, allowNull: false },
      body_ar: { type: DataTypes.TEXT, allowNull: false },
      type: {
        type: DataTypes.ENUM(
          "assignment",
          "quiz",
          "homework",
          "message",
          "tree_ready",
          "task_confirmed",
          "announcement",
        ),
        allowNull: false,
      },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    },
    { sequelize, modelName: "Notification" },
  );

  return Notification;
};
