'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatbotMessage extends Model {
    static associate(models) {
      ChatbotMessage.belongsTo(models.ChatbotSession, { foreignKey: 'session_id' });
    }
  }

  ChatbotMessage.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'ChatbotMessage',
      tableName: 'chatbot_messages',
      underscored: true,
      timestamps: false,
    }
  );

  return ChatbotMessage;
};
