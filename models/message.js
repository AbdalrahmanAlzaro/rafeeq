'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    static associate(models) {
      Message.belongsTo(models.User, { foreignKey: 'sender_user_id', as: 'Sender' });
      Message.belongsTo(models.User, { foreignKey: 'receiver_user_id', as: 'Receiver' });
      Message.belongsTo(models.Child, { foreignKey: 'child_id' });
    }
  }

  Message.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      sender_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      receiver_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      child_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.ENUM('chat', 'note', 'chatbot'),
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('user', 'assistant'),
        allowNull: true,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attachment_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      session_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      sent_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Message',
      tableName: 'messages',
    }
  );

  return Message;
};
