'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ChatbotSession extends Model {
    static associate(models) {
      ChatbotSession.belongsTo(models.User, { foreignKey: 'user_id' });
      ChatbotSession.hasMany(models.ChatbotMessage, { foreignKey: 'session_id' });
    }
  }

  ChatbotSession.init(
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      summary: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      message_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: 'ChatbotSession',
      tableName: 'chatbot_sessions',
      underscored: true,
      timestamps: false,
    }
  );

  return ChatbotSession;
};
