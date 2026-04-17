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
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
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
