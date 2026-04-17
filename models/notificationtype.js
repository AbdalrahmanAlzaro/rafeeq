'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class NotificationType extends Model {
    static associate(models) {
      NotificationType.hasMany(models.Notification, { foreignKey: 'type_id' });
    }
  }

  NotificationType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: false,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'NotificationType',
      tableName: 'notification_types',
      underscored: true,
      timestamps: false,
    }
  );

  return NotificationType;
};
