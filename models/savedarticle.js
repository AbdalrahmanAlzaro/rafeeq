'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class SavedArticle extends Model {
    static associate(models) {
      SavedArticle.belongsTo(models.User, { foreignKey: 'user_id' });
      SavedArticle.belongsTo(models.Article, { foreignKey: 'article_id' });
    }
  }

  SavedArticle.init(
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
      article_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SavedArticle',
      tableName: 'saved_articles',
      underscored: true,
      timestamps: false,
    }
  );

  return SavedArticle;
};
