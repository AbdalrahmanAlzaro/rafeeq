'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Topic extends Model {
    static associate(models) {
      Topic.belongsTo(models.Subject, { foreignKey: 'subject_id' });
      Topic.hasMany(models.LearningTree, { foreignKey: 'topic_id' });
    }
  }

  Topic.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      subject_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      level: {
        type: DataTypes.INTEGER,
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
      modelName: 'Topic',
      tableName: 'topics',
      underscored: true,
      timestamps: false,
    }
  );

  return Topic;
};
