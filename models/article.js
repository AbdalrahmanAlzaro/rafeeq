'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Article extends Model {
    static associate(models) {
      Article.hasMany(models.SavedArticle, { foreignKey: 'article_id' });
    }
  }

  Article.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      content_ar: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content_en: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image_url: {
        type: DataTypes.STRING(500),
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Article',
      tableName: 'articles',
      underscored: true,
      timestamps: false,
    }
  );

  return Article;
};
