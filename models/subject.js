'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Subject extends Model {
    static associate(models) {
      Subject.hasMany(models.Topic, { foreignKey: 'subject_id' });
    }
  }

  Subject.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name_ar: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      name_en: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Subject',
      tableName: 'subjects',
      underscored: true,
      timestamps: false,
    }
  );

  return Subject;
};
