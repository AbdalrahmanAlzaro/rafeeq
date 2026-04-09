"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: "sender_user_id", as: "Sender" });
      Message.belongsTo(models.User, { foreignKey: "receiver_user_id", as: "Receiver" });
    }
  }

  Message.init(
    {
      sender_user_id: { type: DataTypes.INTEGER, allowNull: false },
      receiver_user_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      sent_at: { type: DataTypes.DATE, allowNull: true },
    },
    { sequelize, modelName: "Message" },
  );

  return Message;
};
