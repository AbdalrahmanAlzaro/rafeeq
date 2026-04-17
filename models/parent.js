'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Parent extends Model {
    static associate(models) {
      Parent.belongsTo(models.User, { foreignKey: 'user_id' });
      Parent.hasMany(models.ChildProfile, { foreignKey: 'parent_id' });
    }
  }

  Parent.init(
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
      full_name_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      full_name_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Parent',
      tableName: 'parents',
      underscored: true,
      timestamps: false,
    }
  );

  return Parent;
};
