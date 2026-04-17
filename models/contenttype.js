'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ContentType extends Model {
    static associate(models) {
      ContentType.hasMany(models.TreeItem, { foreignKey: 'content_type_id' });
      ContentType.hasMany(models.ChildScoreLog, { foreignKey: 'content_type_id' });
    }
  }

  ContentType.init(
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
      modelName: 'ContentType',
      tableName: 'content_types',
      underscored: true,
      timestamps: false,
    }
  );

  return ContentType;
};
