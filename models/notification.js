'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, { foreignKey: 'user_id' });
      Notification.belongsTo(models.NotificationType, { foreignKey: 'type_id' });
    }
  }

  Notification.init(
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
      type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      title_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      body_ar: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      body_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      ref_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      ref_type: {
        type: DataTypes.STRING(50),
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Notification',
      tableName: 'notifications',
      underscored: true,
      timestamps: false,
    }
  );

  return Notification;
};
